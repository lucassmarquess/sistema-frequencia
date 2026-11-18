
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

const novoId = aulas.length === 0
    ? 1
    : Math.max(...aulas.map(aula => Number(aula.id) || 0)) + 1;

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

function formatarData(valor) {
    const [ano, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${ano}`;
}

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
    <main class="criar-aula-page">

        <header class="page-header">
            <div class="brand">
                <div class="brand-icon">
                    <i class="bi bi-mortarboard-fill"></i>
                </div>

                <div>
                    <h1>Sistema de Frequência</h1>
                    <p>Painel do professor</p>
                </div>
            </div>

            <button class="btn-back-header" @click="voltar">
                <i class="bi bi-arrow-left"></i>
                Voltar
            </button>
        </header>

        <section class="page-content">

            <div class="welcome-section">
                <div>
                    <h2>Nova aula</h2>
                    <p>Preencha as informações para iniciar uma nova aula.</p>
                </div>

                <div class="welcome-icon">
                    <i class="bi bi-journal-plus"></i>
                </div>
            </div>

            <section class="form-card">

                <div class="form-heading">
                    <div class="form-heading-icon">
                        <i class="bi bi-pencil-square"></i>
                    </div>

                    <div>
                        <h3>Informações da aula</h3>
                        <p>Escolha uma disciplina para continuar.</p>
                    </div>
                </div>

                <form @submit.prevent="criar">

                    <div class="form-group">
                        <label for="disciplina">
                            Disciplina
                        </label>

                        <select
                            id="disciplina"
                            v-model="disciplina"
                            required
                        >
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

                            <option value="nova">
                                + Nova disciplina
                            </option>
                        </select>
                    </div>

                    <div
                        v-if="disciplina === 'nova'"
                        class="form-group new-subject"
                    >
                        <label for="materia">
                            Nome da nova disciplina
                        </label>

                        <input
                            id="materia"
                            type="text"
                            placeholder="Digite o nome da disciplina"
                            v-model="materia"
                            required
                        >
                    </div>

                    <div class="date-info-grid">

                        <div class="date-info-card">
                            <div class="date-icon">
                                <i class="bi bi-calendar-event"></i>
                            </div>

                            <div>
                                <span>Data da aula</span>
                                <strong>{{ formatarData(data) }}</strong>
                            </div>
                        </div>

                        <div class="date-info-card">
                            <div class="date-icon">
                                <i class="bi bi-clock"></i>
                            </div>

                            <div>
                                <span>Horário de criação</span>
                                <strong>{{ horario }}</strong>
                            </div>
                        </div>

                    </div>

                    <div v-if="erro" class="error-message">
                        <i class="bi bi-exclamation-circle-fill"></i>
                        {{ erro }}
                    </div>

                    <div class="form-actions">
                        <button
                            type="button"
                            class="btn-cancel"
                            @click="voltar"
                        >
                            Cancelar
                        </button>

                        <button type="submit" class="btn-submit">
                            <i class="bi bi-plus-circle"></i>
                            Criar aula
                        </button>
                    </div>

                </form>
            </section>

            <div class="info-message">
                <i class="bi bi-info-circle"></i>
                <span>
                    Ao criar a aula, você será direcionado para a tela de
                    gerenciamento de presenças.
                </span>
            </div>

        </section>
    </main>
</template>

<style scoped>
.criar-aula-page {
    min-height: 100vh;
    background-color: #f1f5f9;
}

/* Cabeçalho */

.page-header {
    background-color: #172554;
    color: white;
    padding: 20px 6%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.brand {
    display: flex;
    align-items: center;
    gap: 14px;
}

.brand-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: #2563eb;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
}

.brand h1 {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
}

.brand p {
    color: #cbd5e1;
    font-size: 13px;
    margin: 4px 0 0;
}

.btn-back-header {
    background: transparent;
    border: 1px solid #64748b;
    color: white;
    border-radius: 8px;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: 0.2s;
}

.btn-back-header:hover {
    background-color: #334155;
}

/* Conteúdo */

.page-content {
    max-width: 950px;
    margin: 0 auto;
    padding: 40px 5%;
}

.welcome-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
}

.welcome-section h2 {
    color: #172554;
    font-size: 26px;
    font-weight: 700;
    margin: 0 0 7px;
}

.welcome-section p {
    color: #64748b;
    margin: 0;
}

.welcome-icon {
    width: 55px;
    height: 55px;
    border-radius: 15px;
    background-color: #dbeafe;
    color: #2563eb;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 27px;
}

/* Formulário */

.form-card {
    background-color: white;
    border-radius: 14px;
    padding: 30px;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}

.form-heading {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 23px;
    margin-bottom: 25px;
    border-bottom: 1px solid #e2e8f0;
}

.form-heading-icon {
    width: 45px;
    height: 45px;
    border-radius: 10px;
    background-color: #eff6ff;
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 21px;
}

.form-heading h3 {
    color: #172554;
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 5px;
}

.form-heading p {
    color: #64748b;
    font-size: 13px;
    margin: 0;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 9px;
    margin-bottom: 22px;
}

.form-group label {
    color: #334155;
    font-size: 14px;
    font-weight: 600;
}

.form-group select,
.form-group input {
    width: 100%;
    height: 46px;
    padding: 0 13px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background-color: white;
    color: #334155;
    outline: none;
    transition: 0.2s;
}

.form-group select:focus,
.form-group input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.new-subject {
    padding: 18px;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
}

/* Data e horário */

.date-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin: 25px 0;
}

.date-info-card {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 17px;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
}

.date-icon {
    width: 42px;
    height: 42px;
    min-width: 42px;
    border-radius: 10px;
    background-color: #dbeafe;
    color: #2563eb;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
}

.date-info-card span,
.date-info-card strong {
    display: block;
}

.date-info-card span {
    color: #64748b;
    font-size: 12px;
    margin-bottom: 5px;
}

.date-info-card strong {
    color: #172554;
    font-size: 15px;
}

/* Mensagem de erro */

.error-message {
    display: flex;
    align-items: center;
    gap: 9px;
    background-color: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 12px 14px;
    font-size: 13px;
    margin-bottom: 20px;
}

/* Botões */

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 28px;
}

.btn-cancel,
.btn-submit {
    border: none;
    border-radius: 8px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 600;
    transition: 0.2s;
}

.btn-cancel {
    background-color: #e2e8f0;
    color: #475569;
}

.btn-cancel:hover {
    background-color: #cbd5e1;
}

.btn-submit {
    background-color: #2563eb;
    color: white;
}

.btn-submit:hover {
    background-color: #1d4ed8;
}

/* Informação */

.info-message {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 20px;
    padding: 15px;
    border-radius: 9px;
    background-color: #eff6ff;
    color: #1e40af;
    font-size: 13px;
    line-height: 1.5;
}

.info-message i {
    font-size: 17px;
}

/* Responsividade */

@media (max-width: 600px) {
    .page-header {
        padding: 16px 5%;
    }

    .brand h1 {
        font-size: 16px;
    }

    .brand-icon {
        width: 42px;
        height: 42px;
        font-size: 21px;
    }

    .btn-back-header {
        padding: 9px 11px;
        font-size: 13px;
    }

    .page-content {
        padding: 28px 4%;
    }

    .welcome-section h2 {
        font-size: 22px;
    }

    .form-card {
        padding: 20px 16px;
    }

    .date-info-grid {
        grid-template-columns: 1fr;
    }

    .form-actions {
        flex-direction: column-reverse;
    }

    .btn-cancel,
    .btn-submit {
        width: 100%;
    }
}
</style>
