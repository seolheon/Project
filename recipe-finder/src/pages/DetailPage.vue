<template>
  <div v-if="recipeDetail" class="recipe-detail">
    <el-image :src="recipeDetail.image" :alt="recipeDetail.title" class="recipe-image"></el-image>
    <h1>{{ recipeDetail.title }}</h1>
    <div v-for="instruction in recipeDetail.instructions" :key="instruction.name" class="instruction">
      <h2>{{ instruction.name }}</h2>
      <div class="steps-container">
        <div v-for="step in instruction.steps" :key="step.number" class="step">
          <div class="step-number">{{ step.number }}</div>
          <div class="step-content">
            <p>{{ step.step }}</p>
            <div class="step-details">
              <div v-if="step.ingredients.length" class="ingredients">
                <h3>Ingredients:</h3>
                <ul>
                  <li v-for="ingredient in step.ingredients" :key="ingredient.id" class="list-items">
                    <el-image :src="ingredient.image" class="ingredient-image" fit="contain"></el-image>
                    {{ ingredient.name }}
                  </li>
                </ul>
              </div>
              <div v-if="step.equipment.length" class="equipment">
                <h3>Equipment:</h3>
                <ul>
                  <li v-for="equipment in step.equipment" :key="equipment.id" class="list-items">
                    <el-image :src="equipment.image" class="equipment-image" fit="contain"></el-image>
                    {{ equipment.name }}
                    <span v-if="equipment.temperature">({{ equipment.temperature.number }}°{{ equipment.temperature.unit }})</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRecipeStore } from '../store';
import { RecipeDetail } from '../types';

const route = useRoute();
const recipeStore = useRecipeStore();
const recipeDetail = ref<RecipeDetail | null>(null);

onMounted(async () => {
  const id = parseInt(route.params.id as string, 10);
  await recipeStore.getRecipeDetail(id);
  recipeDetail.value = recipeStore.recipeDetail;
});
</script>

<style scoped>
.recipe-detail {
  font-family: 'Montserrat', sans-serif;
  background-color: #202020;
  color: #fff;
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

.recipe-image {
  width: 100%;
  max-width: 300px;
  object-fit: cover;
  margin-bottom: 20px;
  border-radius: 20px;
}

.instruction {
  margin-bottom: 20px;
  padding: 0% 10%;
}

.steps-container {
  display: flex;
  flex-direction: column;
}

.step {
  display: flex;
  margin-bottom: 20px;
  gap: 20px;
  border-top: 2px solid #303030;
  border-bottom: 2px solid #303030; 
  padding: 20px 0px;
}

.step-number {
  min-width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #050505;
  border: 2px solid #303030; 
  color: #71d1b1;
  font-size: 1.2em;
  border-radius: 50%;
}

.step-content {
  text-align: left;
}

.step-details {
  margin-left: 10px;
  display: flex;
  gap: 40px;
}

.ingredients h3,
.equipment h3 {
  color: #71d1b1;
  margin-bottom: 5px;
}


.ingredient-image,
.equipment-image {
  width: 100px;
  height: 100px;
  background-color: #fff;
  margin-right: 10px;
  border-radius: 8px;
  object-fit: contain;
}


.list-items {
  display: flex;
  align-items: center;
  padding: 5px 0px;
}

</style>
