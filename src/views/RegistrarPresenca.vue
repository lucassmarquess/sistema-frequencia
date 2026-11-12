
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

import QrCodeService from "@/services/QrCodeService";
import AlunoService from "@/services/AlunoService";
import PresencaService from "@/services/PresencaService";
import Presenca from "@/models/Presenca";

const route = useRoute();

const token = route.params.token;

const email = ref("");
const mensagem = ref("");
const aula = ref(null);
const codigoValido = ref(false);
const registroConcluido = ref(false);

// Verifica o QR Code assim que a página é carregada.
function verificarCodigo() {
    const resultado = QrCodeService.validar(token);

    if (resultado.valido === false) {
        codigoValido.value = false;
        mensagem.value = resultado.mensagem;
        return;
    }

    codigoValido.value = true;
    aula.value = resultado.aula;
    mensagem.value = "";
}

verificarCodigo();

// Gera um ID novo para cada presença.
function gerarNovoId() {
    const presencas = PresencaService.listar();

    if (presencas.length === 0) {
        return 1;
    }

    return Math.max(
        ...presencas.map(presenca => Number(presenca.id) || 0)
    ) + 1;
}

// Obtém a data e o horário locais.
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

function registrarPresenca() {
    mensagem.value = "";

    // Verifica novamente para impedir o uso de um código expirado.
    const resultado = QrCodeService.validar(token);

    if (resultado.valido === false) {
        codigoValido.value = false;
        mensagem.value = resultado.mensagem;
        return;
    }

    const emailInformado = email.value.trim().toLowerCase();

    if (emailInformado === "") {
        mensagem.value = "Informe seu e-mail.";
        return;
    }

    // Procura o aluno pelo e-mail cadastrado.
    const alunos = AlunoService.listar();

    const aluno = alunos.find(
        elemento =>
            elemento.email.trim().toLowerCase() === emailInformado
    );

    if (aluno === undefined) {
        mensagem.value = "Não encontramos um aluno cadastrado com esse e-mail.";
        return;
    }

    if (aluno.ativo === false) {
        mensagem.value = "Este cadastro de aluno está inativo.";
        return;
    }

    const novaPresenca = new Presenca(
        gerarNovoId(),
        aluno.id,
        resultado.aula.id,
        obterDataHora(),
        "presente"
    );

    const cadastro = PresencaService.cadastrar(novaPresenca);

    if (cadastro === "Cadastro realizado") {
        registroConcluido.value = true;
        mensagem.value = `Presença registrada com sucesso, ${aluno.nome}!`;
        return;
    }

    mensagem.value = cadastro;
}

// Verifica o código novamente ao entrar na página.
</script>

<template>
    <div>
        <h1>Registro de Presença</h1>

        <div v-if="registroConcluido">
            <h2>Presença confirmada!</h2>
            <p>{{ mensagem }}</p>
        </div>

        <div v-else-if="codigoValido">
            <h2>{{ aula.disciplina }}</h2>

            <p>Data: {{ aula.data }}</p>
            <p>Horário: {{ aula.horario }}</p>

            <form @submit.prevent="registrarPresenca">
                <label for="email">Informe seu e-mail:</label>
                <br>

                <input
                    id="email"
                    type="email"
                    v-model="email"
                    placeholder="seuemail@exemplo.com"
                    required
                >

                <br><br>

                <button type="submit">
                    Registrar Presença
                </button>
            </form>

            <p v-if="mensagem">{{ mensagem }}</p>
        </div>

        <div v-else>
            <p>{{ mensagem }}</p>
        </div>
    </div>
</template>
