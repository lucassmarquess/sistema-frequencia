
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
    const restante = Math.ceil(
        (Number(QrCodeService.validar(tokenQrCode.value).codigo?.expiraEm || 0) - Date.now()) / 1000
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

        <div v-if="aula.status === 'aberta'">
            <button
                type="button"
                @click="abrirQrCode"
            >
                Abrir QR Code
            </button>

            <div v-if="imagemQrCode">
                <h2>QR Code da aula</h2>

                <img
                    :src="imagemQrCode"
                    alt="QR Code para registro de presença"
                    width="250"
                >

                <p>Tempo restante: {{ tempoFormatado }}</p>

                <p>
                    Endereço:
                    <a :href="linkQrCode">{{ linkQrCode }}</a>
                </p>

                <button
                    type="button"
                    @click="fecharQrCode"
                >
                    Encerrar QR Code
                </button>
            </div>

            <br>

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
