<script setup>
    import { useRouter } from 'vue-router';
    import AuthService from '../../services/AuthService';
    import FrequenciaService from '@/services/FrequenciaService';


    const router = useRouter();
    const usuario = AuthService.usuarioLogado();
    const frequenciaTotal = FrequenciaService.calcularFrequenciaGeral(usuario.id);
    const disciplinas = FrequenciaService.totalDisciplinas();
    
    function logout() {
        AuthService.logout();
        router.push('/');
    }
</script>
<template>
    <h1>DashBoard do Aluno</h1>
    <p>Olá, {{ usuario.nome }}</p>
    <p>Sua Frequência Geral: {{ frequenciaTotal }}%</p>
    <br>
    <p>Minhas Disciplinas</p>
    <ul>
        <li v-for="disciplina in disciplinas" :key="disciplina">
            {{ disciplina }}: {{ FrequenciaService.calcularFrequenciaDisciplina(usuario.id, disciplina) }}%
        </li>
    </ul>
    <button @click="logout">Sair</button>
</template>