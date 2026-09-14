<script setup>
    import { useRouter } from 'vue-router';
    import { useRoute } from 'vue-router';
    import FrequenciaService from '@/services/FrequenciaService';
    import Aula from '@/models/Aula';
    import AulaService from '@/services/AulaService';

    const router = useRouter();

    const route = useRoute();
    const indice = Number(route.params.indice);

    const disciplinas = FrequenciaService.totalDisciplinas(); 
    const disciplina = [...disciplinas][indice];

    const aulas = FrequenciaService.totalAulaPorDisciplina(disciplina);
    const Aulas = FrequenciaService.aulasDeDisciplina(disciplina);
    console.log(Aulas);

    const totalDeAulas = AulaService.listar();
    const ultimaAula = totalDeAulas[totalDeAulas.length - 1];
    const token = ultimaAula.token;
    const numero = Number(token.replace("token", ""));
    const novoToken = "token" + (numero + 1);
    const data = new Date().toISOString().split('T')[0];
    const horario = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
    const novoId = totalDeAulas.length + 1;
    
    function voltar() {
        router.push('/DashBoardProfessor');
    }
    function criarAula() {
        AulaService.cadastrar(
            new Aula(novoId, disciplina, data, horario, "aberta", novoToken)
        );
        console.log("nova aula");
    }
    function verPresenca(id) {
        router.push(`/PresencasProfessor/${id}`);
    }
</script>
<template>
    <p>{{ disciplina }}</p>
    <p>Total de Aulas: {{ aulas }}</p>
    <p>Aulas:</p>
    <ul>
        <li v-for="aula in Aulas" :key="aula.id">
            <p>{{ aula.data }}  *  {{ aula.horario }}</p>
            <p>Status: {{ aula.status }}</p>
            <button @click="verPresenca(aula.id)">Ver Presenças</button>
        </li>
    </ul>
    <button @click="criarAula">+ Criar Nova Aula</button><br>
    <button @click="voltar">Voltar</button>
</template>