<template>
  <div class="search-page">
    <h1>Поиск рецептов по ингредиентам</h1>
    <div class="input-container">
      <el-input
        v-model="ingredientInput"
        placeholder="Введите ингредиенты"
        @input="handleInput"
        class="ingredient-input"
      ></el-input>
    </div>
    <div v-if="flag && ingredientSuggestions && ingredientSuggestions.length" class="ingredient-cards">
      <div
        v-for="ingredient in ingredientSuggestions"
        :key="ingredient.id"
        @click="toggleSelection(ingredient)"
        :class="{ 'selected': isSelected(ingredient) }"
        class="ingredient-card"
      >
        <div class="ingredient-image-container">
          <img :src="ingredient.image" alt="Ingredient Image" class="ingredient-image" />
        </div>
        <p>{{ ingredient.name }}</p>
      </div>
    </div>
    <el-button type="primary" @click="handleClick" class="search-button">Искать</el-button>
    <div class="selected-ingredients" v-if="selectedIngredients.length > 0">
      <el-tag
        v-for="(ingredient, index) in selectedIngredients"
        :key="index"
        closable
        @close="removeIngredient(index)"
        class="selected-tag"
      >
        {{ ingredient.name }}
      </el-tag>
    </div>
    <div class="recipe-grid" v-if="!flag && recipes && recipes.length">
      <router-link :to="'/recipe/' + recipe.id" class="recipe-card" v-for="recipe in recipes" :key="recipe.id">
        <img :src="recipe.image" alt="Recipe Image" class="recipe-image" />
        <h3>{{ recipe.title }}</h3>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRecipeStore } from '../store';
import { Ingredient } from '../types';
import { debounce } from 'lodash';

const recipeStore = useRecipeStore();

const recipes = computed(() => recipeStore.recipes);

const ingredientInput = ref('');
const selectedIngredients = ref<Ingredient[]>([]);

const ingredientSuggestions = computed(() => recipeStore.ingredientSuggestions);

const flag = ref(true)

const fetchSuggestions = async () => {
  if (ingredientInput.value.trim()) {
    try {
      await recipeStore.getIngredientSuggestions(ingredientInput.value.trim());
    } catch (error) {
      console.error('Error fetching ingredient suggestions:', error);
    }
  } else {
    recipeStore.ingredientSuggestions = [];
  }
};

const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

const toggleSelection = (ingredient: Ingredient) => {
  if (!isSelected(ingredient)) {
    selectedIngredients.value.push(ingredient)
  } else {
    removeIngredient(selectedIngredients.value.findIndex(item => item === ingredient))
  }
};

const isSelected = (ingredient: Ingredient) => {
  return selectedIngredients.value.some(item => item === ingredient);
};

const removeIngredient = (index: number) => {
  selectedIngredients.value.splice(index, 1);
};

const toggleFlag = (value: boolean) => {
  flag.value = value;
};

const handleInput = () => {
  debouncedFetchSuggestions();
  toggleFlag(true);
};

const handleClick = () => {
  searchRecipes();
  toggleFlag(false);
};

const searchRecipes = async () => {
  const ingredientNames = selectedIngredients.value.map(ingredient => ingredient.name);
  try {
    await recipeStore.getRecipesByIngredients(ingredientNames, 10);
  } catch (error) {
    console.error('Error fetching recipes by ingredients:', error);
  }
};
</script>

<style scoped>
.search-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Montserrat', sans-serif;
  background-color: #282828;
  color: #fff;
}

h1 {
  color: #71d1b1;
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 20px;
}

.input-container {
  margin-bottom: 20px;
}

.ingredient-input {
  width: 100%;
}

.ingredient-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.ingredient-card {
  cursor: pointer;
  border: 1px solid #71d1b1;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  transition: transform 0.2s;
}

.ingredient-card.selected {
  background-color: #71d1b1;
  border-color: #71d1b1;
  color: #fff;
  transform: scale(1.05);
}

.ingredient-image-container {
  display: flex;
  justify-content: center;
}

.ingredient-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
}

.search-button {
  width: 100%;
  margin-bottom: 20px;
}

.selected-ingredients {
  margin-top: 20px;
}

.selected-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.recipe-card {
  border: 1px solid #71d1b1;
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.2s;
}

.recipe-card:hover {
  transform: scale(1.05);
}

.recipe-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
</style>
