import { defineStore } from 'pinia';
import { recipes } from '../api';
import { Recipe, RecipeDetail, Ingredient } from '../types';


export const useRecipeStore = defineStore('recipe-store', {
  state: () => ({
    recipes: <Recipe[]>[],
    recipeDetail: <RecipeDetail | null>null,
    totalResults: 0,
    ingredientSuggestions: <Ingredient[]>[],
    ingredients: <Ingredient[]>[],
  }),
  actions: {
    async getRecipes(params: { [key: string]: any }) {
      try {
        const response = await recipes.fetchRecipes(params);
        this.recipes = response.results;
        this.totalResults = response.totalResults;
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    },
    async getRecipeDetail(id: number) {
      try {
        const response = await recipes.fetchRecipeDetail(id);
        this.recipeDetail = response;
      } catch (error) {
        console.error('Error fetching recipe detail:', error);
      }
    },
    async getRecipesByIngredients(ingredients: string[], number: number) {
      try {
        const response = await recipes.fetchRecipesByIngredients(ingredients, number);
        this.recipes = response;
        console.log('Fetched recipes data:', response);
      } catch (error) {
        console.error('Error fetching recipes by ingredients:', error);
      }
    },
    async getIngredientSuggestions(query: string) {
      try {
        const response = await recipes.fetchIngredientSuggestions(query);
        if (response.data) {
          this.ingredientSuggestions = response.data.map((ingredient: Ingredient) => {
            ingredient.image = `https://img.spoonacular.com/ingredients_100x100/${ingredient.image}`;
            return ingredient;
          });
        }
        console.log('Fetched ingredient data:', this.ingredientSuggestions);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    },
  },
});