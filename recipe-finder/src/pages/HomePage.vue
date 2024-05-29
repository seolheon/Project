<template>
  <div class="recipe-page">
    <h1>Recipes</h1>
    <el-input v-model="query" placeholder="Search..." @input="debouncedSearch" class="search-input"></el-input>
    <div class="recipe-grid">
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
    <el-infinite-scroll @load="fetchNext" :distance="10">
      <el-loading v-if="loading" text="Loading..." :fullscreen="false"></el-loading>
    </el-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRecipeStore } from '../store';
import { debounce } from 'lodash';
import { Recipe } from '../types';

const recipeStore = useRecipeStore();
const query = ref('');
const currentPage = ref(1);
const pageSize = ref(25);
const loading = ref(false);
const allRecipes = ref(<Recipe[]>[]);

const fetchRecipes = async () => {
  loading.value = true;
  try {
    console.log(`Fetching recipes with query: ${query.value}, page: ${currentPage.value}, pageSize: ${pageSize.value}`);
    await recipeStore.getRecipes({ query: query.value, offset: (currentPage.value - 1) * pageSize.value, number: pageSize.value });
    allRecipes.value.push(...recipeStore.recipes);
    console.log('Current recipes in store:', recipeStore.recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
  } finally {
    loading.value = false;
  }
};

const fetchNext = async () => {
  const recipesValue = allRecipes.value;
  const totalResultsValue = totalResults.value;
  if (recipesValue.length < totalResultsValue && !loading.value) {
    currentPage.value++;
    await fetchRecipes();
  }
};

const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  allRecipes.value = [];
  fetchRecipes();
}, 500);

onMounted(() => {
  fetchRecipes();
  window.addEventListener('scroll', handleScroll);
});

const recipes = computed(() => allRecipes.value);
const totalResults = computed(() => recipeStore.totalResults);

const handleScroll = () => {
  const scrollY = window.scrollY;
  const clientHeight = document.documentElement.clientHeight;
  const scrollHeight = document.documentElement.scrollHeight;
  if (scrollY + clientHeight >= scrollHeight) {
    fetchNext();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

.recipe-page {
  font-family: 'Montserrat', sans-serif;
  background-color: #202020;
  color: #fff;
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

h1 {
  color: #71d1b1;
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  margin-bottom: 20px;
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

.el-input__inner {
  background-color: #282828;
  color: #fff;
  border: 1px solid #454545;
}

.el-input__inner::placeholder {
  color: #959595;
}

.el-loading {
  text-align: center;
  padding: 20px;
}
</style>
