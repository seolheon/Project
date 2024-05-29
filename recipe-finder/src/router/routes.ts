
import { RouteRecordRaw } from "vue-router"
import HomePage from '../pages/HomePage.vue';
import RecipeDetailPage from '../pages/DetailPage.vue';
import SearchPage from '../pages/SearchPage.vue';

const routes: readonly RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetail',
    component: RecipeDetailPage,
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchPage,
  },
];

export default routes
