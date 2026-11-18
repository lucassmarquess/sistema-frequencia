
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

function formatarData(data) {
    if (!data) return "--";

    const partes = data.split("-");

    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
</script>

<template>
    <main class="disciplina-professor">

        <!-- Cabeçalho -->
        <header class="discipline-header">
            <div>
                <span class="discipline-subtitle">GERENCIAMENTO ACADÊMICO</span>

                <h1 v-if="disciplina">{{ disciplina }}</h1>

                <h1 v-else>Disciplina não encontrada</h1>

                <p v-if="disciplina">
                    Gerencie as aulas e acompanhe as presenças dos alunos.
                </p>
            </div>

            <button
                class="btn btn-outline-primary back-button"
                @click="voltar"
            >
                <i class="bi bi-arrow-left"></i>
                Voltar
            </button>
        </header>

        <!-- Conteúdo da disciplina -->
        <template v-if="disciplina">

            <!-- Indicador -->
            <section class="discipline-section">
                <article class="total-card">
                    <div class="total-icon">
                        <i class="bi bi-journal-text"></i>
                    </div>

                    <div>
                        <p class="total-label">Total de aulas</p>
                        <p class="total-value">{{ aulas }}</p>
                    </div>
                </article>
            </section>

            <!-- Lista de aulas -->
            <section class="discipline-section">
                <div class="section-heading">
                    <div>
                        <h2 class="section-title">Aulas cadastradas</h2>
                        <p class="section-description">
                            Selecione uma aula para consultar as presenças.
                        </p>
                    </div>

                    <span class="lesson-count">
                        {{ aulasDaDisciplina.length }} aulas
                    </span>
                </div>

                <div v-if="aulasDaDisciplina.length > 0" class="row g-4">

                    <div
                        v-for="aula in aulasDaDisciplina"
                        :key="aula.id"
                        class="col-12 col-md-6 col-xl-4"
                    >
                        <article class="lesson-card">

                            <div class="lesson-card-header">
                                <div class="lesson-icon">
                                    <i class="bi bi-calendar-event"></i>
                                </div>

                                <span
                                    class="lesson-status"
                                    :class="aula.status === 'aberta'
                                        ? 'status-open'
                                        : 'status-closed'"
                                >
                                    {{ aula.status }}
                                </span>
                            </div>

                            <h3>Aula #{{ aula.id }}</h3>

                            <div class="lesson-information">
                                <p>
                                    <i class="bi bi-calendar3"></i>
                                    {{ formatarData(aula.data) }}
                                </p>

                                <p>
                                    <i class="bi bi-clock"></i>
                                    {{ aula.horario }}
                                </p>
                            </div>

                            <button
                                class="btn btn-primary lesson-button"
                                @click="verPresenca(aula.id)"
                            >
                                <i class="bi bi-clipboard-check"></i>
                                Ver presenças
                            </button>

                        </article>
                    </div>

                </div>

                <div v-else class="empty-state">
                    <i class="bi bi-calendar-x"></i>
                    <h3>Nenhuma aula cadastrada</h3>
                    <p>Crie uma nova aula para começar a registrar presenças.</p>
                </div>
            </section>

            <!-- Criar aula -->
            <button
                class="btn btn-primary create-lesson-button"
                @click="criarAula"
            >
                <i class="bi bi-plus-lg"></i>
                Criar nova aula
            </button>

        </template>

        <!-- Disciplina inválida -->
        <div v-else class="empty-state">
            <i class="bi bi-exclamation-circle"></i>
            <h3>Disciplina não encontrada</h3>
            <p>Não foi possível localizar a disciplina solicitada.</p>
        </div>

        <!-- Mensagem de erro -->
        <div v-if="erro" class="alert alert-danger error-message">
            <i class="bi bi-exclamation-triangle"></i>
            {{ erro }}
        </div>

    </main>
</template>

<style scoped>
.disciplina-professor {
    min-height: 100vh;
    padding: 40px;
    background-color: #f1f5f9;
}

.discipline-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 40px;
}

.discipline-subtitle {
    color: #2563eb;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
}

.discipline-header h1 {
    margin: 8px 0;
    color: #172554;
    font-size: 30px;
    font-weight: 700;
}

.discipline-header p,
.section-description {
    color: #64748b;
    margin: 0;
}

.back-button {
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 600;
}

.discipline-section {
    margin-bottom: 35px;
}

.total-card {
    display: flex;
    align-items: center;
    gap: 20px;
    max-width: 350px;
    padding: 24px;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04);
}

.total-icon {
    width: 58px;
    height: 58px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #dbeafe;
    color: #2563eb;
    border-radius: 12px;
    font-size: 26px;
}

.total-label {
    color: #64748b;
    margin-bottom: 5px;
    font-size: 14px;
}

.total-value {
    color: #172554;
    font-size: 28px;
    font-weight: 700;
    margin: 0;
}

.section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 20px;
}

.section-title {
    color: #172554;
    font-size: 21px;
    font-weight: 700;
    margin-bottom: 5px;
}

.lesson-count {
    padding: 7px 12px;
    background-color: #dbeafe;
    color: #1d4ed8;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
}

.lesson-card {
    height: 100%;
    padding: 24px;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lesson-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.lesson-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.lesson-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eff6ff;
    color: #2563eb;
    border-radius: 10px;
    font-size: 21px;
}

.lesson-status {
    padding: 6px 11px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: capitalize;
}

.status-open {
    background-color: #dcfce7;
    color: #15803d;
}

.status-closed {
    background-color: #fee2e2;
    color: #b91c1c;
}

.lesson-card h3 {
    color: #172554;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 18px;
}

.lesson-information {
    margin-bottom: 20px;
}

.lesson-information p {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 8px 0;
    color: #64748b;
    font-size: 14px;
}

.lesson-information i {
    color: #2563eb;
}

.lesson-button {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    font-weight: 600;
}

.empty-state {
    padding: 55px 20px;
    background-color: #ffffff;
    border: 1px dashed #cbd5e1;
    border-radius: 14px;
    text-align: center;
}

.empty-state > i {
    color: #94a3b8;
    font-size: 42px;
}

.empty-state h3 {
    margin: 15px 0 8px;
    color: #172554;
    font-size: 18px;
}

.empty-state p {
    color: #64748b;
    margin: 0;
}

.create-lesson-button {
    padding: 11px 18px;
    border-radius: 8px;
    font-weight: 600;
}

.error-message {
    margin-top: 20px;
}

@media (max-width: 768px) {
    .disciplina-professor {
        padding: 24px 16px;
    }

    .discipline-header h1 {
        font-size: 24px;
    }
}

@media (max-width: 480px) {
    .discipline-header {
        align-items: flex-start;
        flex-direction: column;
    }

    .back-button {
        align-self: flex-end;
    }

    .section-heading {
        align-items: flex-start;
        flex-direction: column;
    }
}
</style>
