
<script setup>
import { useRouter, useRoute } from 'vue-router';
import AlunoService from '@/services/AlunoService';
import FrequenciaService from '@/services/FrequenciaService';

const router = useRouter();
const route = useRoute();

const id = Number(route.params.id);
const aluno = AlunoService.buscarPorId(id);

const frequenciaTotal = FrequenciaService.calcularFrequenciaGeral(aluno.id);
const ausenciasJustificadas = FrequenciaService.calcularAusenciasJustificadas(aluno.id);
const disciplinas = Array.from(FrequenciaService.totalDisciplinas());

function voltar() {
    router.push('/DashBoardProfessor');
}

const formatarNumero = (numero) => {
    if (numero === null || numero === undefined || Number.isNaN(numero)) {
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

function frequenciaDisciplina(disciplina) {
    return FrequenciaService.calcularFrequenciaDisciplina(
        aluno.id,
        disciplina
    );
}

function larguraBarra(numero) {
    if (numero === null || numero === undefined || Number.isNaN(numero)) {
        return 0;
    }

    return Math.min(100, Math.max(0, numero));
}
</script>

<template>
    <main class="aluno-professor">

        <!-- Cabeçalho -->
        <header class="profile-header">
            <div>
                <span class="profile-subtitle">DESEMPENHO ACADÊMICO</span>
                <h1>{{ aluno.nome }}</h1>
                <p>Acompanhe a frequência e o desempenho deste estudante.</p>
            </div>

            <button
                class="btn btn-outline-primary back-button"
                @click="voltar"
            >
                <i class="bi bi-arrow-left"></i>
                Voltar
            </button>
        </header>

        <!-- Indicadores -->
        <section class="profile-section">
            <h2 class="section-title">Resumo do aluno</h2>

            <div class="row g-4">

                <div class="col-12 col-md-6">
                    <article class="summary-card">
                        <div class="summary-icon frequency-icon">
                            <i class="bi bi-graph-up-arrow"></i>
                        </div>

                        <div>
                            <p class="summary-label">Frequência geral</p>
                            <p class="summary-value">
                                {{ formatarNumero(frequenciaTotal) }}%
                            </p>
                        </div>
                    </article>
                </div>

                <div class="col-12 col-md-6">
                    <article class="summary-card">
                        <div class="summary-icon absence-icon">
                            <i class="bi bi-calendar-check"></i>
                        </div>

                        <div>
                            <p class="summary-label">Ausências justificadas</p>
                            <p class="summary-value">
                                {{ formatarNumero(ausenciasJustificadas) }}%
                            </p>
                        </div>
                    </article>
                </div>

            </div>
        </section>

        <!-- Disciplinas -->
        <section class="profile-section">
            <div class="section-heading">
                <div>
                    <h2 class="section-title">Desempenho por disciplina</h2>
                    <p class="section-description">
                        Frequência individual em cada matéria.
                    </p>
                </div>

                <span class="discipline-count">
                    {{ disciplinas.length }} disciplinas
                </span>
            </div>

            <div v-if="disciplinas.length > 0" class="row g-4">

                <div
                    v-for="disciplina in disciplinas"
                    :key="disciplina"
                    class="col-12 col-md-6 col-xl-4"
                >
                    <article class="discipline-card">

                        <div class="discipline-icon">
                            <i class="bi bi-book"></i>
                        </div>

                        <h3>{{ disciplina }}</h3>

                        <div class="discipline-frequency">
                            <span>Frequência</span>

                            <strong>
                                {{
                                    frequenciaDisciplina(disciplina) === null
                                        ? "--"
                                        : formatarNumero(frequenciaDisciplina(disciplina)) + "%"
                                }}
                            </strong>
                        </div>

                        <div
                            class="frequencia-progress"
                            role="progressbar"
                            :aria-valuenow="larguraBarra(frequenciaDisciplina(disciplina))"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            <div
                                class="frequencia-progress-bar"
                                :style="{
                                    width: larguraBarra(frequenciaDisciplina(disciplina)) + '%'
                                }"
                            ></div>
                        </div>

                    </article>
                </div>

            </div>

            <div v-else class="empty-state">
                <i class="bi bi-journal-x"></i>
                <h3>Nenhuma disciplina encontrada</h3>
                <p>As disciplinas cadastradas aparecerão aqui.</p>
            </div>
        </section>

    </main>
</template>

<style scoped>
.aluno-professor {
    min-height: 100vh;
    padding: 40px;
    background-color: #f1f5f9;
}

.profile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 40px;
}

.profile-subtitle {
    color: #2563eb;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
}

.profile-header h1 {
    margin: 8px 0;
    color: #172554;
    font-size: 30px;
    font-weight: 700;
}

.profile-header p,
.section-description {
    color: #64748b;
    margin: 0;
}

.back-button {
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 600;
}

.profile-section {
    margin-bottom: 40px;
}

.section-title {
    color: #172554;
    font-size: 21px;
    font-weight: 700;
    margin-bottom: 20px;
}

.summary-card {
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

.summary-icon {
    width: 58px;
    height: 58px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 26px;
}

.frequency-icon {
    background-color: #dbeafe;
    color: #2563eb;
}

.absence-icon {
    background-color: #dcfce7;
    color: #16a34a;
}

.summary-label {
    color: #64748b;
    margin-bottom: 5px;
    font-size: 14px;
}

.summary-value {
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

.discipline-count {
    padding: 7px 12px;
    background-color: #dbeafe;
    color: #1d4ed8;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
}

.discipline-card {
    height: 100%;
    padding: 24px;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04);
}

.discipline-icon {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    background-color: #eff6ff;
    color: #2563eb;
    border-radius: 10px;
    font-size: 20px;
}

.discipline-card h3 {
    color: #172554;
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 22px;
}

.discipline-frequency {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    color: #64748b;
    font-size: 14px;
}

.discipline-frequency strong {
    color: #172554;
    font-size: 16px;
}

.frequencia-progress {
    width: 100%;
    height: 10px;
    display: block;
    overflow: hidden;
    background-color: #e2e8f0;
    border-radius: 10px;
}

.frequencia-progress-bar {
    display: block;
    height: 100%;
    background-color: #2563eb;
    border-radius: 10px;
    transition: width 0.3s ease;
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

@media (max-width: 768px) {
    .aluno-professor {
        padding: 24px 16px;
    }

    .profile-header h1 {
        font-size: 24px;
    }

    .summary-value {
        font-size: 24px;
    }
}

@media (max-width: 480px) {
    .profile-header {
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
