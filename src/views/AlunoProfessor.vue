<script setup>
    import { useRouter } from 'vue-router';
    import { useRoute } from 'vue-router';
    import AlunoService from '@/services/AlunoService';
    import FrequenciaService from '@/services/FrequenciaService';

    const router = useRouter();

    const route = useRoute();
    const id = Number(route.params.id);

    const aluno = AlunoService.buscarPorId(id);

    const frequenciaTotal = FrequenciaService.calcularFrequenciaGeral(aluno.id);
    const disciplinas = FrequenciaService.totalDisciplinas();
    
    function voltar() {
        router.push('/DashBoardProfessor');
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
    <p>{{ aluno.nome }}</p>
    <p>Frequência Geral: {{ formatarNumero(frequenciaTotal) }}%</p>
    <br>
    <p>Disciplinas</p>
    <ul>
        <li v-for="disciplina in disciplinas" :key="disciplina">
            {{ disciplina }}: {{ formatarNumero(FrequenciaService.calcularFrequenciaDisciplina(aluno.id, disciplina)) }}%
        </li>
    </ul>
    <button @click="voltar">Voltar</button>
</template>