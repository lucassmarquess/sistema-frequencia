<script setup>
    import { useRouter } from 'vue-router';
    import AlunoService from '@/services/AlunoService';
    import AulaService from '@/services/AulaService';
    import FrequenciaService from '@/services/FrequenciaService';
    import AuthService from '@/services/AuthService';

    const alunos = AlunoService.listar();
    const totalAlunos = alunos.length;
    
    const aulas = AulaService.listar();
    const totalAulas = aulas.length;

    const disciplinas = FrequenciaService.totalDisciplinas();
    const frequenciaGeral = FrequenciaService.calcularFrequenciaDeTodos();

    const router = useRouter();

    const usuario = AuthService.usuarioLogado();
    function logout() {
        AuthService.logout();
        router.push('/');
    }
    
    
</script>
<template>
    <h1>Sistema de Frequência</h1><button @click="logout()">Sair</button>
    <p>Olá, professor: {{ usuario.nome }}</p>
    <div class="container">
        <div><p>Alunos</p><p>{{ totalAlunos }}</p></div>
        <div><p>Aulas</p><p>{{ totalAulas }}</p></div>
        <div><p>Frequência</p><p>{{ frequenciaGeral }}</p></div>
    </div>
    <p>Alunos:</p>
    <ul>
        <li v-for="aluno in alunos" :key="aluno.id">
            {{ aluno.nome }} | Frequêncis: {{FrequenciaService.calcularFrequenciaGeral(aluno.id)}}%
        </li>
    </ul>
    <p>Minhas Disciplinas:</p>
    <ul>
        <div>
            <li v-for="disciplina in disciplinas" :key="disciplina">
                {{ disciplina }} <br>
                Aulas: {{ FrequenciaService.totalAulaPorDisciplina(disciplina) }}
            </li>
        </div>
    </ul>
</template>
<style>
    div{
        display: inline;
        margin-right: 10px;
    }
    .container{
        display: flex;
    }
</style>