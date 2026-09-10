import { createRouter, createWebHistory } from 'vue-router'
import AuthService from '@/services/AuthService.js';
import Login from "../views/Login.vue";
import DashBoard from '../views/DashBoard/DashBoardAluno.vue';
import TesteDados from '../views/TesteDados.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/DashBoardAluno',
      component: DashBoard
    },
    {
      path: '/Teste',
      component: TesteDados
    }
  ],
})
router.beforeEach((to, from) => {
    if (to.path === '/DashBoardAluno' && AuthService.estaAutenticado() === false) {
        return '/';
    }
    return true;
});

export default router
