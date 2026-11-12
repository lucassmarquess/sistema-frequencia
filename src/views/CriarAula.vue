
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import Aula from '@/models/Aula';
import AulaService from '@/services/AulaService';
import FrequenciaService from '@/services/FrequenciaService';

const router = useRouter();

const disciplina = ref("");
const materia = ref("");
const erro = ref("");

const disciplinas = FrequenciaService.totalDisciplinas();

const aulas = AulaService.listar();

// Gera o próximo ID considerando todas as aulas existentes.
const novoId = aulas.length === 0
    ? 1
    : Math.max(...aulas.map(aula => Number(aula.id) || 0)) + 1;

// Obtém a data e o horário locais.
const agora = new Date();

const data = [
    agora.getFullYear(),
    String(agora.getMonth() + 1).padStart(2, "0"),
    String(agora.getDate()).padStart(2, "0")
].join("-");

const horario = [
    String(agora.getHours()).padStart(2, "0"),
    String(agora.getMinutes()).padStart(2, "0")
].join(":");

function criar() {
    erro.value = "";

    let disciplinaEscolhida;

    if (disciplina.value === "nova") {
        disciplinaEscolhida = materia.value.trim();
    } else {
        disciplinaEscolhida = disciplina.value;
    }

    if (!disciplinaEscolhida) {
        erro.value = "Selecione ou informe uma disciplina.";
        return;
    }

    const novaAula = new Aula(
        novoId,
        disciplinaEscolhida,
        data,
        horario,
        "aberta"
    );

    const resultado = AulaService.cadastrar(novaAula);

    if (resultado !== "Aula cadastrada com sucesso") {
        erro.value = resultado;
        return;
    }

    router.push(`/PresencasProfessor/${novoId}`);
}

function voltar() {
    router.push("/DashBoardProfessor");
}
</script>

<template>
    <h1>Nova Aula</h1>

    <form @submit.prevent="criar">
        <label for="disciplina">Disciplina:</label>

        <select id="disciplina" v-model="disciplina">
            <option disabled value="">
                Selecione uma disciplina
            </option>

            <option
                v-for="item in disciplinas"
                :key="item"
                :value="item"
            >
                {{ item }}
            </option>

            <option value="nova">+ Nova disciplina</option>
        </select>

        <div v-if="disciplina === 'nova'">
            <input
                type="text"
                placeholder="Nova Disciplina"
                v-model="materia"
            >
        </div>

        <p>Data: {{ data }}</p>
        <p>Horário: {{ horario }}</p>

        <p v-if="erro">{{ erro }}</p>

        <button type="submit">Criar Aula</button>
    </form>

    <button type="button" @click="voltar">
        Voltar
    </button>
</template>
