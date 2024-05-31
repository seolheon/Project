<template>
  <div class="nav-bar">
  <el-menu mode="horizontal" class="nav-menu" :default-active="currentRoute">
    <el-menu-item index="/">
      <router-link to="/" class="nav-link">Home</router-link>
    </el-menu-item>
    <el-menu-item index="/search">
      <router-link to="/search" class="nav-link">Search</router-link>
    </el-menu-item>
    <el-menu-item index="back"v-if="isDetailPage" @click="goBack">
      <div class="nav-link">Back</div>
    </el-menu-item>
  </el-menu>
</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();

const currentRoute = computed(() => route.path);

const isDetailPage = computed(() => {
  return route.name === 'RecipeDetail';
});

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

.nav-bar {
  max-width: 80%;
  margin: 0 auto;
  padding: 0px 20px;
  background-color: #303030;
}

.nav-menu {
  background-color: #303030;
  border: none;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  justify-content: center;

}

.el-menu--horizontal>.el-menu-item {
  color: #fff;
}

.el-menu--horizontal>.el-menu-item a {
  color: #fff;
}


.el-menu--horizontal.el-menu {
  border: none;
}

.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 2px solid #71d1b1;
}

.nav-link {
  font-size: 1.2em;
  text-decoration: none;
  transition: color 0.3s, border-bottom 0.3s;
  padding-bottom: 5px;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: #549982;
}
</style>
