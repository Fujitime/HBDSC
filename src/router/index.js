import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CustomCard from '../components/CustomCard.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/card/:name',
    name: 'CustomCard',
    component: CustomCard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
