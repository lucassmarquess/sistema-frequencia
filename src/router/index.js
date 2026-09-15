import { createRouter, createWebHistory } from 'vue-router'

import AuthService from '@/services/AuthService.js';
import AlunoService from '@/services/AlunoService.js';

import Login from "../views/Login.vue";
import DashBoardAluno from '../views/DashBoardAluno.vue';
import DashBoardProfessor from '../views/DashBoardProfessor.vue';
import AlunoProfessor from '@/views/AlunoProfessor.vue';
import TesteDados from '../views/TesteDados.vue';
import DisciplinaProfessor from '@/views/DisciplinaProfessor.vue';
import PresencasProfessor from '@/views/PresencasProfessor.vue';
import CriarAula from '@/views/CriarAula.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/DashBoardAluno',
      component: DashBoardAluno,
      meta: {
          requerAutenticacao: true,
          tipo: 'aluno'
      }
    },
    {
      path: '/DashBoardProfessor',
      component: DashBoardProfessor,
      meta: {
          requerAutenticacao: true,
          tipo: 'professor'
      }
    },
    {
        path: '/AlunoProfessor/:id',
        component: AlunoProfessor,
        meta: {
            requerAutenticacao: true,
            tipo: 'professor'
        }
    },
    {
      path: '/DisciplinaProfessor/:indice',
      component: DisciplinaProfessor,
      meta: {
          requerAutenticacao: true,
          tipo: 'professor'
      }
    },
    {
      path: '/PresencasProfessor/:id',
      component: PresencasProfessor,
      meta: {
          requerAutenticacao: true,
          tipo: 'professor'
      }
    },
    {
      path: '/CriarAula',
      component: CriarAula,
      meta: {
          requerAutenticacao: true,
          tipo: 'professor'
      }
    },
    {
      path: '/Teste',
      component: TesteDados,
      meta: {
          requerAutenticacao: true
      }
    }
    ],
})
router.beforeEach((to, from) => {

  // Verifica se a rota exige autenticação
  if (to.meta.requerAutenticacao) {

    // Usuário não está autenticado
    if (AuthService.estaAutenticado() === false) {
        return '/';
    }
    // Verifica se a rota exige um tipo específico de usuário
    if (to.meta.tipo) {
        const tipoUsuario = AuthService.tipoUsuario();

      // Usuário possui tipo diferente do permitido
      if (tipoUsuario !== to.meta.tipo) {
          return '/';
      }
    }
  }
  // Verifica se a rota AlunoProfessor possui um aluno válido
  if (to.path.startsWith('/AlunoProfessor/')) {
    const id = Number(to.params.id);
    const aluno = AlunoService.buscarPorId(id);

    if (!aluno) {
        return '/DashBoardProfessor';
    }
  }
  return true;
});
export default router