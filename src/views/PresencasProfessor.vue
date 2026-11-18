
<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AulaService from '@/services/AulaService';
import AlunoService from '@/services/AlunoService';
import PresencaService from '@/services/PresencaService';
import Presenca from '@/models/Presenca';
import FrequenciaService from '@/services/FrequenciaService';
import QrCodeService from '@/services/QrCodeService';

import QRCode from 'qrcode';

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

// Estados relacionados ao QR Code.
const imagemQrCode = ref("");
const linkQrCode = ref("");
const tokenQrCode = ref("");
const tempoRestante = ref(0);

let intervaloQrCode = null;

const tempoFormatado = computed(() => {
    const minutos = Math.floor(tempoRestante.value / 60);
    const segundos = tempoRestante.value % 60;

    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
});

// Se a aula não existir, retorna ao painel.
if (!aula.value) {
    router.replace("/DashBoardProfessor");
}

// Atualiza os registros exibidos na tela.
function atualizarPresencas() {
    presencas.value = PresencaService.listar();
}

// Atualiza a lista quando outra aba registra uma presença.
function observarAlteracoesStorage(evento) {
    if (evento.key === "presencas") {
        atualizarPresencas();
    }
}

// Verifica se o aluno está ativo.
function alunoAtivo(aluno) {
    return aluno.ativo !== false;
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

// Atualiza o contador e verifica a expiração.
function atualizarContador() {
    const resultado = QrCodeService.validar(tokenQrCode.value);

    if (resultado.valido === false) {
        limparQrCode();
        mensagem.value = resultado.mensagem;
        return;
    }

    const restante = Math.ceil(
        (resultado.codigo.expiraEm - Date.now()) / 1000
    );

    if (restante <= 0) {
        QrCodeService.invalidar(tokenQrCode.value);
        limparQrCode();
        mensagem.value = "O QR Code expirou. Gere um novo código se necessário.";
        return;
    }

    tempoRestante.value = restante;
}

// Limpa os dados exibidos do QR Code.
function limparQrCode() {
    if (intervaloQrCode !== null) {
        clearInterval(intervaloQrCode);
        intervaloQrCode = null;
    }

    imagemQrCode.value = "";
    linkQrCode.value = "";
    tokenQrCode.value = "";
    tempoRestante.value = 0;
}

// Gera a imagem do QR Code.
async function abrirQrCode() {
    mensagem.value = "";

    if (!aula.value || aula.value.status !== "aberta") {
        mensagem.value = "Não é possível gerar QR Code para uma aula encerrada.";
        return;
    }

    limparQrCode();

    const resultado = QrCodeService.gerar(aulaId);

    if (resultado.sucesso === false) {
        mensagem.value = resultado.mensagem;
        return;
    }

    const token = resultado.codigo.token;

    const baseUrl = import.meta.env.BASE_URL.endsWith("/")
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL}/`;

    const link = `${window.location.origin}${baseUrl}presenca/${token}`;

    try {
        const imagem = await QRCode.toDataURL(link, {
            width: 250,
            margin: 2
        });

        tokenQrCode.value = token;
        linkQrCode.value = link;
        imagemQrCode.value = imagem;

        atualizarContador();

        intervaloQrCode = setInterval(() => {
            atualizarContador();
        }, 1000);

    } catch (erro) {
        QrCodeService.invalidar(token);
        mensagem.value = "Não foi possível gerar a imagem do QR Code.";
        console.error(erro);
    }
}

// Encerra manualmente o QR Code.
function fecharQrCode() {
    if (tokenQrCode.value !== "") {
        QrCodeService.invalidar(tokenQrCode.value);
    }

    limparQrCode();
    mensagem.value = "QR Code encerrado.";
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
        QrCodeService.invalidarPorAula(aulaId);
        limparQrCode();

        aula.value = aulaAtual;
        mensagem.value = "Aula encerrada com sucesso.";
    } else {
        mensagem.value = resultado;
    }
}

function marcarPresenca(alunoId) {
    const aluno = alunos.value.find(
        elemento => elemento.id === alunoId
    );

    if (!aluno || !alunoAtivo(aluno)) {
        mensagem.value = "Não é possível registrar presença para um aluno inativo.";
        return;
    }

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
    const aluno = alunos.value.find(
        elemento => elemento.id === alunoId
    );

    if (!aluno || !alunoAtivo(aluno)) {
        mensagem.value = "Não é possível justificar falta para um aluno inativo.";
        return;
    }

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

    QrCodeService.invalidarPorAula(aulaId);

    limparQrCode();

    if (AulaService.listar().length === 0) {
        router.push("/DashBoardProfessor");
    } else {
        voltar();
    }
}

// Observa alterações no LocalStorage feitas por outras abas.
window.addEventListener("storage", observarAlteracoesStorage);

// Limpa os eventos e o intervalo quando o professor sai da página.
onUnmounted(() => {
    if (intervaloQrCode !== null) {
        clearInterval(intervaloQrCode);
    }

    window.removeEventListener("storage", observarAlteracoesStorage);
});
</script>

<template>
    <main v-if="aula" class="presencas-professor">

        <!-- Cabeçalho -->
        <header class="attendance-header">
            <div>
                <span class="attendance-subtitle">GERENCIAMENTO DE PRESENÇAS</span>

                <h1>{{ aula.disciplina }}</h1>

                <p>
                    Gerencie os registros de presença desta aula.
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

        <!-- Informações da aula -->
        <section class="attendance-section">
            <article class="lesson-information-card">
                <div class="lesson-information-item">
                    <i class="bi bi-calendar3"></i>

                    <div>
                        <span>Data</span>
                        <strong>{{ aula.data }}</strong>
                    </div>
                </div>

                <div class="lesson-information-item">
                    <i class="bi bi-clock"></i>

                    <div>
                        <span>Horário</span>
                        <strong>{{ aula.horario }}</strong>
                    </div>
                </div>

                <div class="lesson-information-item">
                    <i class="bi bi-info-circle"></i>

                    <div>
                        <span>Status da aula</span>

                        <strong
                            class="lesson-status"
                            :class="aula.status === 'aberta'
                                ? 'status-open'
                                : 'status-closed'"
                        >
                            {{ aula.status }}
                        </strong>
                    </div>
                </div>
            </article>
        </section>

        <!-- Mensagens -->
        <div
            v-if="mensagem"
            class="alert alert-info feedback-message"
            role="status"
        >
            <i class="bi bi-info-circle"></i>
            {{ mensagem }}
        </div>

        <!-- Lista de alunos -->
        <section class="attendance-section">
            <div class="section-heading">
                <div>
                    <h2 class="section-title">Alunos</h2>

                    <p class="section-description">
                        Consulte e gerencie a situação de cada estudante.
                    </p>
                </div>

                <span class="student-count">
                    {{ alunos.length }} alunos
                </span>
            </div>

            <div v-if="alunos.length > 0" class="row g-4">

                <div
                    v-for="aluno in alunos"
                    :key="aluno.id"
                    class="col-12 col-lg-6"
                >
                    <article class="student-card">

                        <div class="student-header">
                            <div class="student-icon">
                                <i class="bi bi-person"></i>
                            </div>

                            <div class="student-information">
                                <h3>{{ aluno.nome }}</h3>
                                <span>Matrícula: {{ aluno.matricula }}</span>
                            </div>

                            <span
                                class="student-status"
                                :class="alunoAtivo(aluno)
                                    ? 'active-student'
                                    : 'inactive-student'"
                            >
                                {{ alunoAtivo(aluno) ? 'Ativo' : 'Inativo' }}
                            </span>
                        </div>

                        <div class="attendance-result">

                            <template v-if="possuiPresenca(aluno.id)">
                                <div class="result-label">
                                    <span>Registro de presença</span>

                                    <strong
                                        class="attendance-badge"
                                        :class="buscarPresenca(aluno.id).status === 'presente'
                                            ? 'present-status'
                                            : 'justified-status'"
                                    >
                                        {{
                                            buscarPresenca(aluno.id).status === 'presente'
                                                ? 'Presente'
                                                : 'Justificada'
                                        }}
                                    </strong>
                                </div>

                                <p
                                    v-if="!alunoAtivo(aluno)"
                                    class="inactive-note"
                                >
                                    <i class="bi bi-info-circle"></i>
                                    Aluno inativo — registro histórico.
                                </p>
                            </template>

                            <div v-else-if="!alunoAtivo(aluno)" class="no-record">
                                <i class="bi bi-person-x"></i>
                                Aluno inativo — sem registro de presença.
                            </div>

                            <div
                                v-else-if="aula.status === 'realizada'"
                                class="student-actions"
                            >
                                <button
                                    type="button"
                                    class="btn btn-outline-warning action-button"
                                    @click="justificarFalta(aluno.id)"
                                >
                                    <i class="bi bi-file-earmark-check"></i>
                                    Justificar falta
                                </button>
                            </div>

                            <div v-else class="student-actions">
                                <button
                                    type="button"
                                    class="btn btn-success action-button"
                                    @click="marcarPresenca(aluno.id)"
                                >
                                    <i class="bi bi-check-circle"></i>
                                    Marcar presença
                                </button>

                                <button
                                    type="button"
                                    class="btn btn-outline-warning action-button"
                                    @click="justificarFalta(aluno.id)"
                                >
                                    <i class="bi bi-file-earmark-check"></i>
                                    Justificar falta
                                </button>
                            </div>

                        </div>
                    </article>
                </div>

            </div>

            <div v-else class="empty-state">
                <i class="bi bi-people"></i>
                <h3>Nenhum aluno encontrado</h3>
                <p>Os alunos cadastrados aparecerão aqui.</p>
            </div>
        </section>

        <!-- QR Code -->
        <section
            v-if="aula.status === 'aberta'"
            class="attendance-section"
        >
            <div class="section-heading">
                <div>
                    <h2 class="section-title">Registro por QR Code</h2>

                    <p class="section-description">
                        Gere um código para que os alunos registrem suas presenças.
                    </p>
                </div>
            </div>

            <article class="qr-card">

                <div v-if="!imagemQrCode" class="qr-empty">
                    <div class="qr-icon">
                        <i class="bi bi-qr-code"></i>
                    </div>

                    <h3>QR Code da aula</h3>

                    <p>
                        Gere um código temporário para permitir o registro
                        de presença dos estudantes.
                    </p>

                    <button
                        type="button"
                        class="btn btn-primary qr-generate-button"
                        @click="abrirQrCode"
                    >
                        <i class="bi bi-qr-code-scan"></i>
                        Gerar QR Code
                    </button>
                </div>

                <div v-else class="qr-active">

                    <div class="qr-image-container">
                        <img
                            :src="imagemQrCode"
                            alt="QR Code para registro de presença"
                            width="250"
                        />
                    </div>

                    <div class="qr-details">
                        <span class="qr-active-label">
                            <i class="bi bi-circle-fill"></i>
                            QR Code ativo
                        </span>

                        <h3>Escaneie para registrar presença</h3>

                        <p class="qr-timer-label">Tempo restante</p>

                        <strong class="qr-timer">
                            {{ tempoFormatado }}
                        </strong>

                        <div class="qr-link">
                            <span>Endereço para acesso:</span>
                            <a :href="linkQrCode" target="_blank">
                                {{ linkQrCode }}
                            </a>
                        </div>

                        <button
                            type="button"
                            class="btn btn-outline-danger qr-close-button"
                            @click="fecharQrCode"
                        >
                            <i class="bi bi-x-circle"></i>
                            Encerrar QR Code
                        </button>
                    </div>

                </div>

            </article>
        </section>

        <!-- Ações da aula -->
        <section class="attendance-section">
            <h2 class="section-title">Ações da aula</h2>

            <div class="lesson-actions">

                <button
                    v-if="aula.status === 'aberta'"
                    type="button"
                    class="btn btn-warning lesson-action-button"
                    @click="encerrarAula"
                >
                    <i class="bi bi-lock"></i>
                    Encerrar aula
                </button>

                <button
                    type="button"
                    class="btn btn-outline-danger lesson-action-button"
                    @click="excluir"
                >
                    <i class="bi bi-trash"></i>
                    Excluir aula
                </button>

                <button
                    type="button"
                    class="btn btn-outline-primary lesson-action-button"
                    @click="voltar"
                >
                    <i class="bi bi-arrow-left"></i>
                    Voltar à disciplina
                </button>

            </div>
        </section>

    </main>
</template>

<style scoped>
.presencas-professor {
    min-height: 100vh;
    padding: 40px;
    background-color: #f1f5f9;
}

.attendance-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 35px;
}

.attendance-subtitle {
    color: #2563eb;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
}

.attendance-header h1 {
    margin: 8px 0;
    color: #172554;
    font-size: 30px;
    font-weight: 700;
}

.attendance-header p,
.section-description {
    color: #64748b;
    margin: 0;
}

.back-button {
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 600;
}

.attendance-section {
    margin-bottom: 35px;
}

.lesson-information-card {
    display: flex;
    flex-wrap: wrap;
    gap: 35px;
    padding: 24px;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04);
}

.lesson-information-item {
    display: flex;
    align-items: center;
    gap: 13px;
}

.lesson-information-item > i {
    color: #2563eb;
    font-size: 24px;
}

.lesson-information-item div {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.lesson-information-item span {
    color: #64748b;
    font-size: 13px;
}

.lesson-information-item strong {
    color: #172554;
    font-size: 15px;
}

.lesson-status {
    text-transform: capitalize;
}

.status-open {
    color: #15803d !important;
}

.status-closed {
    color: #b91c1c !important;
}

.feedback-message {
    margin-bottom: 30px;
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

.student-count {
    padding: 7px 12px;
    background-color: #dbeafe;
    color: #1d4ed8;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
}

.student-card {
    height: 100%;
    padding: 22px;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04);
}

.student-header {
    display: flex;
    align-items: center;
    gap: 13px;
    margin-bottom: 22px;
}

.student-icon {
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eff6ff;
    color: #2563eb;
    border-radius: 10px;
    font-size: 22px;
}

.student-information {
    min-width: 0;
    flex: 1;
}

.student-information h3 {
    margin: 0 0 4px;
    color: #172554;
    font-size: 16px;
    font-weight: 700;
    overflow-wrap: anywhere;
}

.student-information span {
    color: #64748b;
    font-size: 12px;
}

.student-status {
    padding: 5px 9px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
}

.active-student {
    background-color: #dcfce7;
    color: #15803d;
}

.inactive-student {
    background-color: #fee2e2;
    color: #b91c1c;
}

.attendance-result {
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
}

.result-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: #64748b;
    font-size: 14px;
}

.attendance-badge {
    padding: 6px 11px;
    border-radius: 20px;
    font-size: 12px;
}

.present-status {
    background-color: #dcfce7;
    color: #15803d;
}

.justified-status {
    background-color: #fef3c7;
    color: #b45309;
}

.inactive-note {
    margin: 12px 0 0;
    color: #64748b;
    font-size: 12px;
}

.no-record {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #94a3b8;
    font-size: 13px;
}

.student-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.action-button {
    flex: 1;
    min-width: 140px;
    padding: 9px 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
}

.qr-card {
    padding: 30px;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04);
}

.qr-empty {
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: center;
    max-width: 450px;
    margin: 0 auto;
}

.qr-icon {
    width: 65px;
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
    background-color: #dbeafe;
    color: #2563eb;
    border-radius: 15px;
    font-size: 32px;
}

.qr-empty h3,
.qr-details h3 {
    color: #172554;
    font-size: 19px;
    font-weight: 700;
}

.qr-empty p {
    color: #64748b;
    margin: 5px 0 20px;
}

.qr-generate-button {
    padding: 11px 20px;
    border-radius: 8px;
    font-weight: 600;
}

.qr-active {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 45px;
}

.qr-image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
}

.qr-image-container img {
    display: block;
    max-width: 100%;
    height: auto;
}

.qr-details {
    max-width: 450px;
}

.qr-active-label {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 12px;
    color: #15803d;
    font-size: 13px;
    font-weight: 700;
}

.qr-active-label i {
    font-size: 9px;
}

.qr-details h3 {
    margin-bottom: 20px;
}

.qr-timer-label {
    margin-bottom: 4px;
    color: #64748b;
    font-size: 13px;
}

.qr-timer {
    display: block;
    margin-bottom: 20px;
    color: #2563eb;
    font-size: 32px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
}

.qr-link {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 20px;
    font-size: 13px;
}

.qr-link span {
    color: #64748b;
}

.qr-link a {
    overflow-wrap: anywhere;
    color: #2563eb;
}

.qr-close-button {
    padding: 10px 15px;
    border-radius: 8px;
    font-weight: 600;
}

.lesson-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.lesson-action-button {
    padding: 11px 17px;
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

@media (max-width: 768px) {
    .presencas-professor {
        padding: 24px 16px;
    }

    .attendance-header h1 {
        font-size: 24px;
    }

    .lesson-information-card {
        gap: 22px;
    }

    .qr-active {
        gap: 25px;
    }
}

@media (max-width: 480px) {
    .attendance-header {
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

    .student-header {
        flex-wrap: wrap;
    }

    .student-status {
        margin-left: auto;
    }

    .student-actions {
        flex-direction: column;
    }

    .action-button {
        width: 100%;
    }

    .qr-card {
        padding: 20px 14px;
    }

    .lesson-actions {
        flex-direction: column;
    }

    .lesson-action-button {
        width: 100%;
    }
}
</style>
