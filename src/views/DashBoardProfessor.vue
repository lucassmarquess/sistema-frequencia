
<script setup>
import { useRouter } from 'vue-router';

import AlunoService from '@/services/AlunoService';
import AulaService from '@/services/AulaService';
import FrequenciaService from '@/services/FrequenciaService';
import AuthService from '@/services/AuthService';

// Lista somente os alunos ativos.
const alunos = AlunoService.listarAtivos();
const totalAlunos = alunos.length;

const aulas = AulaService.listar();
const totalAulas = aulas.length;

const disciplinas = Array.from(FrequenciaService.totalDisciplinas());
const frequenciaGeral = FrequenciaService.calcularFrequenciaDeTodos();

const router = useRouter();
const usuario = AuthService.usuarioLogado();

function logout() {
    AuthService.logout();
    router.push('/');
}

function abrirAluno(id) {
    router.push(`/AlunoProfessor/${id}`);
}

function abrirDisciplina(indice) {
    router.push(`/DisciplinaProfessor/${indice}`);
}

function novaDisciplina() {
    router.push("/CriarAula");
}

const formatarNumero = (numero) => {
    if (
        numero === null ||
        numero === undefined ||
        Number.isNaN(numero)
    ) {
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
    <main class="professor-dashboard">

        <!-- Cabeçalho -->
        <header class="dashboard-header">
            <div>
                <span class="dashboard-subtitle">ÁREA DO PROFESSOR</span>
                <h1>Olá, {{ usuario.nome }}!</h1>
                <p>Gerencie seus alunos, aulas e disciplinas.</p>
            </div>

            <button
                class="btn btn-outline-danger logout-button"
                @click="logout"
            >
                <i class="bi bi-box-arrow-right"></i>
                Sair
            </button>
        </header>

        <!-- Indicadores -->
        <section class="dashboard-section">
            <h2 class="section-title">Visão geral</h2>

            <div class="row g-4">

                <div class="col-12 col-md-4">
                    <article class="dashboard-card">
                        <div class="card-icon students-icon">
                            <i class="bi bi-people"></i>
                        </div>

                        <div>
                            <p class="card-label">Alunos ativos</p>
                            <p class="card-value">{{ totalAlunos }}</p>
                        </div>
                    </article>
                </div>

                <div class="col-12 col-md-4">
                    <article class="dashboard-card">
                        <div class="card-icon lessons-icon">
                            <i class="bi bi-journal-text"></i>
                        </div>

                        <div>
                            <p class="card-label">Aulas cadastradas</p>
                            <p class="card-value">{{ totalAulas }}</p>
                        </div>
                    </article>
                </div>

                <div class="col-12 col-md-4">
                    <article class="dashboard-card">
                        <div class="card-icon frequency-icon">
                            <i class="bi bi-graph-up-arrow"></i>
                        </div>

                        <div>
                            <p class="card-label">Frequência geral</p>
                            <p class="card-value">
                                {{ formatarNumero(frequenciaGeral) }}%
                            </p>
                        </div>
                    </article>
                </div>

            </div>
        </section>

        <!-- Alunos -->
        <section class="dashboard-section">
            <div class="section-heading">
                <div>
                    <h2 class="section-title">Alunos</h2>
                    <p class="section-description">
                        Consulte o desempenho individual dos estudantes.
                    </p>
                </div>

                <span class="item-count">
                    {{ totalAlunos }} alunos
                </span>
            </div>

            <div v-if="alunos.length > 0" class="row g-4">

                <div
                    v-for="aluno in alunos"
                    :key="aluno.id"
                    class="col-12 col-md-6 col-xl-4"
                >
                    <article
                        class="student-card"
                        @click="abrirAluno(aluno.id)"
                    >
                        <div class="student-card-header">
                            <div class="student-icon">
                                <i class="bi bi-person"></i>
                            </div>

                            <i class="bi bi-arrow-up-right card-arrow"></i>
                        </div>

                        <h3>{{ aluno.nome }}</h3>

                        <div class="student-frequency">
                            <span>Frequência geral</span>

                            <strong>
                                {{
                                    formatarNumero(
                                        FrequenciaService.calcularFrequenciaGeral(aluno.id)
                                    )
                                }}%
                            </strong>
                        </div>

                        <span class="card-link">
                            Ver desempenho
                            <i class="bi bi-arrow-right"></i>
                        </span>
                    </article>
                </div>

            </div>

            <div v-else class="empty-state">
                <i class="bi bi-people"></i>
                <h3>Nenhum aluno encontrado</h3>
                <p>Os alunos ativos aparecerão aqui.</p>
            </div>
        </section>

        <!-- Disciplinas -->
        <section class="dashboard-section">
            <div class="section-heading">
                <div>
                    <h2 class="section-title">Minhas disciplinas</h2>
                    <p class="section-description">
                        Acesse as aulas e frequências de cada disciplina.
                    </p>
                </div>

                <span class="item-count">
                    {{ disciplinas.length }} disciplinas
                </span>
            </div>

            <div v-if="disciplinas.length > 0" class="row g-4">

                <div
                    v-for="(disciplina, indice) in disciplinas"
                    :key="disciplina"
                    class="col-12 col-md-6 col-xl-4"
                >
                    <article
                        class="discipline-card"
                        @click="abrirDisciplina(indice)"
                    >
                        <div class="discipline-icon">
                            <i class="bi bi-book"></i>
                        </div>

                        <h3>{{ disciplina }}</h3>

                        <p class="lesson-count">
                            <i class="bi bi-calendar3"></i>

                            {{ FrequenciaService.totalAulaPorDisciplina(disciplina) }}
                            aulas cadastradas
                        </p>

                        <span class="card-link">
                            Acessar disciplina
                            <i class="bi bi-arrow-right"></i>
                        </span>
                    </article>
                </div>

            </div>

            <div v-else class="empty-state">
                <i class="bi bi-journal-x"></i>
                <h3>Nenhuma disciplina encontrada</h3>
                <p>Crie uma aula para começar a organizar suas disciplinas.</p>
            </div>

            <button
                class="btn btn-primary create-lesson-button"
                @click="novaDisciplina"
            >
                <i class="bi bi-plus-lg"></i>
                Criar aula em nova disciplina
            </button>
        </section>

    </main>
</template>

<style scoped>
.professor-dashboard {
    min-height: 100vh;
    padding: 40px;
    background-color: #f1f5f9;
}

.dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 40px;
}

.dashboard-subtitle {
    color: #2563eb;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
}

.dashboard-header h1 {
    margin: 8px 0;
    color: #172554;
    font-size: 30px;
    font-weight: 700;
}

.dashboard-header p,
.section-description {
    color: #64748b;
    margin: 0;
}

.logout-button {
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 600;
}

.dashboard-section {
    margin-bottom: 40px;
}

.section-title {
    color: #172554;
    font-size: 21px;
    font-weight: 700;
    margin-bottom: 20px;
}

.dashboard-card {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 26px;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04);
}

.card-icon {
    width: 58px;
    height: 58px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 26px;
}

.students-icon {
    background-color: #dbeafe;
    color: #2563eb;
}

.lessons-icon {
    background-color: #f3e8ff;
    color: #9333ea;
}

.frequency-icon {
    background-color: #dcfce7;
    color: #16a34a;
}

.card-label {
    color: #64748b;
    margin-bottom: 5px;
    font-size: 14px;
}

.card-value {
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

.section-heading .section-title {
    margin-bottom: 5px;
}

.item-count {
    padding: 7px 12px;
    background-color: #dbeafe;
    color: #1d4ed8;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
}

.student-card,
.discipline-card {
    height: 100%;
    padding: 24px;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.student-card:hover,
.discipline-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.student-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
}

.student-icon,
.discipline-icon {
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

.card-arrow {
    color: #94a3b8;
    font-size: 18px;
}

.student-card h3,
.discipline-card h3 {
    color: #172554;
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 18px;
}

.student-frequency {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    color: #64748b;
    font-size: 14px;
}

.student-frequency strong {
    color: #172554;
    font-size: 16px;
}

.discipline-icon {
    margin-bottom: 18px;
}

.lesson-count {
    color: #64748b;
    font-size: 14px;
    margin-bottom: 22px;
}

.card-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #2563eb;
    font-size: 14px;
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
    margin-top: 25px;
    padding: 11px 18px;
    border-radius: 8px;
    font-weight: 600;
}

@media (max-width: 768px) {
    .professor-dashboard {
        padding: 24px 16px;
    }

    .dashboard-header h1 {
        font-size: 24px;
    }

    .dashboard-header {
        align-items: flex-start;
    }

    .card-value {
        font-size: 24px;
    }
}

@media (max-width: 480px) {
    .dashboard-header {
        flex-direction: column;
    }

    .logout-button {
        align-self: flex-end;
    }

    .section-heading {
        align-items: flex-start;
        flex-direction: column;
    }
}
</style>
