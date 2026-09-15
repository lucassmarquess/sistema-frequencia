<script setup>
    import { useRouter } from 'vue-router';
    import AuthService from '../services/AuthService';
    import FrequenciaService from '@/services/FrequenciaService';


    const router = useRouter();
    const usuario = AuthService.usuarioLogado();
    const frequenciaTotal = FrequenciaService.calcularFrequenciaGeral(usuario.id);
    const disciplinas = FrequenciaService.totalDisciplinas();
    
    function logout() {
        AuthService.logout();
        router.push('/');
    }
    const formatarNumero = (numero) => {
        if (Number.isNaN(numero)) {
            return "--";
        }

        if (Number.isInteger(numero)) {
            return numero.toString();
        }

        return numero.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };
</script>
<template>
    <h1>DashBoard do Aluno</h1>
    <p>Olá, {{ usuario.nome }}</p>
    <p>Sua Frequência Geral: {{ formatarNumero(frequenciaTotal) }}%</p>
    <br>
    <p>Minhas Disciplinas</p>
    <ul>
        <li v-for="disciplina in disciplinas" :key="disciplina">
            {{ disciplina }}: {{ formatarNumero(FrequenciaService.calcularFrequenciaDisciplina(usuario.id, disciplina)) }}%
        </li>
    </ul>
    <button @click="logout">Sair</button>
</template>