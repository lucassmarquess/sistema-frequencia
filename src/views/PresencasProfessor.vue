
<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AulaService from '@/services/AulaService';
import AlunoService from '@/services/AlunoService';
import PresencaService from '@/services/PresencaService';
import Presenca from '@/models/Presenca';
import FrequenciaService from '@/services/FrequenciaService';

const route = useRoute();
const router = useRouter();

const aulaId = Number(route.params.id);

const aula = ref(AulaService.buscarPorId(aulaId));

const alunos = ref(AlunoService.listar());

const presencas = ref(PresencaService.listar());

const mensagem = ref("");

const disciplinas = [...FrequenciaService.totalDisciplinas()];

const indice = disciplinas.findIndex(
    disciplina => disciplina === aula.value?.disciplina
);

// Se a aula não existir, retorna ao painel.
if (!aula.value) {
    router.replace("/DashBoardProfessor");
}

// Atualiza os registros exibidos na tela.
function atualizarPresencas() {
    presencas.value = PresencaService.listar();
}

// Gera um ID novo para cada presença.
function gerarNovoId() {
    const registros = PresencaService.listar();

    if (registros.length === 0) {
        return 1;
    }

    return Math.max(
        ...registros.map(presenca => Number(presenca.id) || 0)
    ) + 1;
}

// Obtém data e horário locais.
function obterDataHora() {
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

    return `${data}T${horario}`;
}

function possuiPresenca(alunoId) {
    return presencas.value.some(
        presenca =>
            presenca.alunoId === alunoId &&
            presenca.aulaId === aulaId
    );
}

function buscarPresenca(alunoId) {
    return presencas.value.find(
        presenca =>
            presenca.alunoId === alunoId &&
            presenca.aulaId === aulaId
    );
}

function encerrarAula() {
    if (!aula.value || aula.value.status !== "aberta") {
        return;
    }

    const aulaAtual = {
        ...aula.value,
        status: "realizada"
    };

    const resultado = AulaService.atualizar(
        aulaId,
        aulaAtual
    );

    if (resultado === "Aula atualizada com sucesso") {
        aula.value = aulaAtual;
        mensagem.value = "Aula encerrada com sucesso.";
    } else {
        mensagem.value = resultado;
    }
}

function marcarPresenca(alunoId) {
    if (aula.value.status !== "aberta") {
        mensagem.value = "Não é possível marcar presença em uma aula encerrada.";
        return;
    }

    const novaPresenca = new Presenca(
        gerarNovoId(),
        alunoId,
        aulaId,
        obterDataHora(),
        "presente"
    );

    const resultado = PresencaService.cadastrar(novaPresenca);

    if (resultado === "Cadastro realizado") {
        atualizarPresencas();
        mensagem.value = "Presença registrada com sucesso.";
    } else {
        mensagem.value = resultado;
    }
}

function justificarFalta(alunoId) {
    const novaPresenca = new Presenca(
        gerarNovoId(),
        alunoId,
        aulaId,
        obterDataHora(),
        "justificada"
    );

    const resultado = PresencaService.cadastrar(novaPresenca);

    if (resultado === "Cadastro realizado") {
        atualizarPresencas();
        mensagem.value = "Falta justificada com sucesso.";
    } else {
        mensagem.value = resultado;
    }
}

function voltar() {
    if (indice === -1) {
        router.push("/DashBoardProfessor");
        return;
    }

    router.push(`/DisciplinaProfessor/${indice}`);
}

function excluir() {
    const confirmar = window.confirm(
        "Tem certeza de que deseja excluir esta aula? Os registros de presença relacionados também serão removidos."
    );

    if (!confirmar) {
        return;
    }

    const resultado = AulaService.remover(aulaId);

    if (resultado !== "Aula removida com sucesso") {
        mensagem.value = resultado;
        return;
    }

    if (AulaService.listar().length === 0) {
        router.push("/DashBoardProfessor");
    } else {
        voltar();
    }
}
</script>

<template>
    <div v-if="aula">
        <h1>{{ aula.disciplina }}</h1>

        <p>{{ aula.data }} * {{ aula.horario }}</p>

        <p>Status: {{ aula.status }}</p>

        <p>Alunos:</p>

        <ul>
            <li v-for="aluno in alunos" :key="aluno.id">
                {{ aluno.nome }}<br>
                {{ aluno.matricula }}<br>

                <div v-if="possuiPresenca(aluno.id)">
                    {{ buscarPresenca(aluno.id).status }}
                </div>

                <div v-else-if="aula.status === 'realizada'">
                    <button
                        type="button"
                        @click="justificarFalta(aluno.id)"
                    >
                        Justificar Falta
                    </button>
                </div>

                <div v-else>
                    <button
                        type="button"
                        @click="marcarPresenca(aluno.id)"
                    >
                        Marcar Presença
                    </button>

                    <button
                        type="button"
                        @click="justificarFalta(aluno.id)"
                    >
                        Justificar Falta
                    </button>
                </div>
            </li>
        </ul>

        <p v-if="mensagem">{{ mensagem }}</p>

        <button type="button" disabled>
            Abrir QR Code
        </button>

        <br>

        <div v-if="aula.status === 'aberta'">
            <button type="button" @click="encerrarAula">
                Encerrar Aula
            </button>
            <br>
        </div>

        <button type="button" @click="excluir">
            Excluir Aula
        </button>

        <br>

        <button type="button" @click="voltar">
            Voltar
        </button>
    </div>
</template>
