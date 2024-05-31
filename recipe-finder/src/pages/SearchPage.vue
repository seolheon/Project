<template>
  <div class="search-page">
    <h1>Recipes by Ingredients</h1>
    <div class="input-container">
      <el-input
        v-model="ingredientInput"
        placeholder="Ingredients here"
        @input="handleInput"
        class="ingredient-input"
      ></el-input>
    </div>
    
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

    <el-button type="primary" @click="handleClick" class="search-button">Find recipe</el-button>

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
    <div v-if="!flag && recipes && recipes.length" class="recipe-grid">
      <router-link
        v-for="recipe in recipes"
        :key="recipe.id"
        :to="'/recipe/' + recipe.id"
        class="recipe-card-link"
      >
        <el-card class="recipe-card">
          <div class="recipe-image-wrapper">
            <img :src="recipe.image" alt="Recipe Image" class="recipe-image"/>
          </div>
          <div class="recipe-info">
            <h3>{{ recipe.title }}</h3>
          </div>
        </el-card>
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

const flag = ref(true);

const fetchSuggestions = async () => {
  if (ingredientInput.value.trim()) {
    try {
      await recipeStore.getIngredientSuggestions(ingredientInput.value.trim());
      console.log('Fetched ingredient suggestions:', recipeStore.ingredientSuggestions);
      selectedIngredients.value = selectedIngredients.value.map(selected => {
        const matchingSuggestion = recipeStore.ingredientSuggestions.find(
          suggestion => suggestion.name === selected.name
        );
        return matchingSuggestion || selected;
      });
    } catch (error) {
      console.error('Error fetching ingredient suggestions:', error);
    }
  } else {
    recipeStore.ingredientSuggestions = [];
  }
};

const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

const toggleSelection = (ingredient: Ingredient) => {
  const index = selectedIngredients.value.findIndex(item => item.name === ingredient.name);
  if (index === -1) {
    selectedIngredients.value.push(ingredient);
  } else {
    selectedIngredients.value.splice(index, 1);
  }
};

const isSelected = (ingredient: Ingredient) => {
  return selectedIngredients.value.some(item => item.name === ingredient.name);
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
  font-family: 'Montserrat', sans-serif;
  background-color: #202020;
  color: #fff;
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 0px 0px 10px 10px;

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
  background-color: #71d1b1;
  color:#282828;
  border: 1px solid #282828;
}

.search-button:hover {
  width: 100%;
  margin-bottom: 20px;
  background-color: #282828;
  color: #71d1b1;
  border: 1px solid #71d1b1;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.recipe-card-link {
  text-decoration: none;
}

.recipe-card {
  display: flex;
  flex-direction: column;
  height: 300px;
  border: 1px solid #454545;
  border-radius: 8px;
  overflow: hidden;
  background-color: #282828;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  position: relative;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.recipe-image-wrapper {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid #454545;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px 8px 0 0; 
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-info {
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7); 
}

.recipe-info h3 {
  margin: 0;
  font-size: 1em;
  color: #fff;
  word-wrap: break-word;
}
</style>
