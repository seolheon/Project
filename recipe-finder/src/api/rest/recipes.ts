import makeRequest from '../httpClient';

// const API_KEY = '3cc8f688adf7459daed0e7bd772c0e98';
// const API_KEY = 'd907bb03583247648ef78636ae60e7ba';
// const API_KEY = 'da04600be815433b982844056e269dad';
const API_KEY = '0454a81dfb494cada462b81bb10598c0';

export const fetchRecipes = (params: { [key: string]: any }) => makeRequest({
  url: 'https://api.spoonacular.com/recipes/complexSearch',
  method: 'GET',
  params: { ...params, number: 25, apiKey: API_KEY }
}).then(response => {
  console.log('API response for fetchRecipes:', response);
  return response.data;
}).catch(error => {
  console.error('Error in fetchRecipes:', error);
  throw error;
});

export const fetchRecipeDetail = async (id: number) => {
  const detailResponse = await makeRequest({
    url: `https://api.spoonacular.com/recipes/${id}/information`,
    method: 'GET',
    params: { apiKey: API_KEY }
  });

  const instructionsResponse = await makeRequest({
    url: `https://api.spoonacular.com/recipes/${id}/analyzedInstructions`,
    method: 'GET',
    params: { apiKey: API_KEY }
  });

  return {
    ...detailResponse.data,
    instructions: instructionsResponse.data
  };
};

export const fetchRecipesByIngredients = (ingredients: string[], number: number) => makeRequest({
  url: 'https://api.spoonacular.com/recipes/findByIngredients',
  method: 'GET',
  params: { ingredients: ingredients.join(','), number, ranking: 2, ignorePantry: true, apiKey: API_KEY }
}).then(response => {
  console.log('API response for fetchRecipesByIngredients:', response);
  return response.data;
}).catch(error => {
  console.error('Error in fetchRecipesByIngredients:', error);
  throw error;
});

export const fetchIngredientSuggestions = (query: string) => makeRequest({
  url: 'https://api.spoonacular.com/food/ingredients/autocomplete',
  method: 'GET',
  params: { query, number: 10, apiKey: API_KEY }
}).then(response => {
  console.log('API response for fetchIngredientSuggestions:', response);
  return response;
}).catch(error => {
  console.error('Error in fetchIngredientSuggestions:', error);
  throw error;
});