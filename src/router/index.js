import { createRouter, createWebHistory } from 'vue-router'
import AuthService from '@/services/AuthService.js';
import Login from "../views/Login.vue";
import DashBoard from '../views/DashBoard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/DashBoard',
      component: DashBoard
    },
  ],
})
router.beforeEach((to, from) => {
    if (to.path === '/DashBoard' && AuthService.estaAutenticado() === false) {
        return '/';
    }
    return true;
});

export default router
