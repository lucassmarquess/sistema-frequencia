
<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import Aula from '@/models/Aula';
import AulaService from '@/services/AulaService';
import FrequenciaService from '@/services/FrequenciaService';

const router = useRouter();
const route = useRoute();

const erro = ref("");

const disciplinas = [...FrequenciaService.totalDisciplinas()];

const indice = Number(route.params.indice);

const disciplina = Number.isInteger(indice) &&
    indice >= 0 &&
    indice < disciplinas.length
        ? disciplinas[indice]
        : null;

const aulas = disciplina
    ? FrequenciaService.totalAulaPorDisciplina(disciplina)
    : 0;

const aulasDaDisciplina = disciplina
    ? FrequenciaService.aulasDeDisciplina(disciplina)
    : [];

function gerarNovoId() {
    const todasAulas = AulaService.listar();

    const maiorId = todasAulas.reduce((maior, aula) => {
        return Math.max(maior, Number(aula.id) || 0);
    }, 0);

    return maiorId + 1;
}

function obterData() {
    const agora = new Date();

    return [
        agora.getFullYear(),
        String(agora.getMonth() + 1).padStart(2, "0"),
        String(agora.getDate()).padStart(2, "0")
    ].join("-");
}

function obterHorario() {
    const agora = new Date();

    return [
        String(agora.getHours()).padStart(2, "0"),
        String(agora.getMinutes()).padStart(2, "0")
    ].join(":");
}

function criarAula() {
    erro.value = "";

    if (!disciplina) {
        erro.value = "Disciplina não encontrada.";
        return;
    }

    const novoId = gerarNovoId();

    const novaAula = new Aula(
        novoId,
        disciplina,
        obterData(),
        obterHorario(),
        "aberta"
    );

    const resultado = AulaService.cadastrar(novaAula);

    if (resultado !== "Aula cadastrada com sucesso") {
        erro.value = resultado;
        return;
    }

    router.push(`/PresencasProfessor/${novoId}`);
}

function verPresenca(id) {
    router.push(`/PresencasProfessor/${id}`);
}

function voltar() {
    router.push('/DashBoardProfessor');
}
</script>

<template>
    <div v-if="disciplina">
        <h1>{{ disciplina }}</h1>

        <p>Total de Aulas: {{ aulas }}</p>

        <h2>Aulas:</h2>

        <ul>
            <li v-for="aula in aulasDaDisciplina" :key="aula.id">
                <p>{{ aula.data }} * {{ aula.horario }}</p>
                <p>Status: {{ aula.status }}</p>

                <button @click="verPresenca(aula.id)">
                    Ver Presenças
                </button>
            </li>
        </ul>

        <button @click="criarAula">
            + Criar Nova Aula
        </button>
    </div>

    <p v-else>
        Disciplina não encontrada.
    </p>

    <p v-if="erro">{{ erro }}</p>

    <button @click="voltar">
        Voltar
    </button>
</template>
