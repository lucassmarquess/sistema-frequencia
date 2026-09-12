import { createRouter, createWebHistory } from 'vue-router'
import AuthService from '@/services/AuthService.js';
import Login from "../views/Login.vue";
import DashBoardAluno from '../views/DashBoardAluno.vue';
import DashBoardProfessor from '../views/DashBoardProfessor.vue';
import AlunoProfessor from '@/views/AlunoProfessor.vue';
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
      component: DashBoardAluno
    },
    {
      path: '/DashBoardProfessor',
      component: DashBoardProfessor
    },
    {
      path: '/AlunoProfessor/:id',
      component: AlunoProfessor
    },
    {
      path: '/Teste',
      component: TesteDados
    }
  ],
})
router.beforeEach((to, from) => {
    if (to.path === '/DashBoardAluno' && AuthService.estaAutenticado() === false && AuthService.tipoUsuario() === "aluno") {
        return '/';
    }
    if (to.path === '/DashBoardProfessor' && AuthService.estaAutenticado() === false && AuthService.tipoUsuario() === "professor") {
        return '/';
    }
    return true;
});

export default router
