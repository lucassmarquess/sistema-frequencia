
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

function gerarNovoId() {
    const presencas = PresencaService.listar();

    if (presencas.length === 0) {
        return 1;
    }

    return Math.max(
        ...presencas.map(presenca => Number(presenca.id) || 0)
    ) + 1;
}

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
</script>

<template>
    <main class="registro-container">
        <section class="registro-card">

            <div class="logo">
                <i class="bi bi-mortarboard-fill"></i>
            </div>

            <h1>Registro de presença</h1>

            <p class="subtitulo">
                Sistema de Frequência Estudantil
            </p>

            <div v-if="registroConcluido" class="resultado sucesso">
                <div class="resultado-icone">
                    <i class="bi bi-check-circle-fill"></i>
                </div>

                <h2>Presença confirmada!</h2>

                <p>{{ mensagem }}</p>

                <div class="mensagem-final">
                    <i class="bi bi-info-circle"></i>
                    Seu registro foi salvo com sucesso.
                </div>
            </div>

            <div v-else-if="codigoValido">
                <div class="aula-info">
                    <span class="etiqueta">Aula atual</span>

                    <h2>{{ aula.disciplina }}</h2>

                    <div class="detalhes-aula">
                        <div>
                            <i class="bi bi-calendar-event"></i>
                            <span>{{ aula.data }}</span>
                        </div>

                        <div>
                            <i class="bi bi-clock"></i>
                            <span>{{ aula.horario }}</span>
                        </div>
                    </div>
                </div>

                <div class="orientacao">
                    <i class="bi bi-qr-code-scan"></i>
                    <p>
                        Informe o e-mail cadastrado no sistema
                        para confirmar sua presença nesta aula.
                    </p>
                </div>

                <form @submit.prevent="registrarPresenca">
                    <label for="email">
                        E-mail do aluno
                    </label>

                    <div class="campo-email">
                        <i class="bi bi-envelope"></i>

                        <input
                            id="email"
                            type="email"
                            v-model="email"
                            placeholder="seuemail@exemplo.com"
                            required
                        >
                    </div>

                    <div v-if="mensagem" class="mensagem erro">
                        <i class="bi bi-exclamation-circle-fill"></i>
                        <span>{{ mensagem }}</span>
                    </div>

                    <button type="submit" class="btn-registrar">
                        <i class="bi bi-check2-circle"></i>
                        Registrar presença
                    </button>
                </form>
            </div>

            <div v-else class="resultado invalido">
                <div class="resultado-icone">
                    <i class="bi bi-x-circle-fill"></i>
                </div>

                <h2>Código indisponível</h2>

                <p>{{ mensagem }}</p>

                <div class="mensagem-final">
                    <i class="bi bi-info-circle"></i>
                    Solicite ao professor um novo QR Code.
                </div>
            </div>

            <div class="rodape">
                Sistema de Frequência Estudantil
            </div>
        </section>
    </main>
</template>

<style scoped>
.registro-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 20px;
    background: linear-gradient(135deg, #172554, #2563eb);
}

.registro-card {
    width: 100%;
    max-width: 470px;
    padding: 38px;
    background-color: #ffffff;
    border-radius: 18px;
    box-shadow: 0 15px 45px rgba(15, 23, 42, 0.2);
}

.logo {
    width: 65px;
    height: 65px;
    margin: 0 auto 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    background-color: #dbeafe;
    color: #2563eb;
    font-size: 30px;
}

.registro-card > h1 {
    margin: 0;
    color: #172554;
    font-size: 25px;
    font-weight: 700;
    text-align: center;
}

.subtitulo {
    margin: 8px 0 28px;
    color: #64748b;
    font-size: 13px;
    text-align: center;
}

.aula-info {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #eff6ff;
    border: 1px solid #dbeafe;
    border-radius: 12px;
}

.etiqueta {
    color: #2563eb;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.7px;
}

.aula-info h2 {
    margin: 8px 0 18px;
    color: #172554;
    font-size: 21px;
    font-weight: 700;
}

.detalhes-aula {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
}

.detalhes-aula div {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #475569;
    font-size: 13px;
}

.detalhes-aula i {
    color: #2563eb;
    font-size: 16px;
}

.orientacao {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 22px;
    color: #64748b;
}

.orientacao i {
    margin-top: 2px;
    color: #2563eb;
    font-size: 22px;
}

.orientacao p {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
}

form label {
    display: block;
    margin-bottom: 8px;
    color: #334155;
    font-size: 13px;
    font-weight: 600;
}

.campo-email {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 13px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    transition: 0.2s ease;
}

.campo-email:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.campo-email i {
    color: #64748b;
}

.campo-email input {
    width: 100%;
    height: 45px;
    border: none;
    outline: none;
    background: transparent;
    color: #334155;
    font-size: 14px;
}

.btn-registrar {
    width: 100%;
    min-height: 46px;
    margin-top: 20px;
    border: none;
    border-radius: 8px;
    background-color: #2563eb;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
}

.btn-registrar:hover {
    background-color: #1d4ed8;
}

.btn-registrar i {
    margin-right: 7px;
}

.mensagem {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 14px;
    padding: 12px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.5;
}

.mensagem.erro {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    color: #b91c1c;
}

.mensagem i {
    margin-top: 1px;
}

.resultado {
    padding: 12px 0 8px;
    text-align: center;
}

.resultado-icone {
    margin-bottom: 15px;
    font-size: 55px;
}

.resultado.sucesso .resultado-icone {
    color: #16a34a;
}

.resultado.invalido .resultado-icone {
    color: #dc2626;
}

.resultado h2 {
    margin-bottom: 10px;
    color: #172554;
    font-size: 21px;
    font-weight: 700;
}

.resultado > p {
    color: #475569;
    font-size: 14px;
    line-height: 1.6;
}

.mensagem-final {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 22px;
    padding: 13px;
    border-radius: 8px;
    background-color: #f1f5f9;
    color: #64748b;
    font-size: 12px;
}

.resultado.sucesso .mensagem-final {
    background-color: #f0fdf4;
    color: #15803d;
}

.rodape {
    margin-top: 30px;
    padding-top: 18px;
    border-top: 1px solid #e2e8f0;
    color: #94a3b8;
    font-size: 11px;
    text-align: center;
}

@media (max-width: 480px) {
    .registro-card {
        padding: 28px 20px;
    }

    .registro-card > h1 {
        font-size: 22px;
    }

    .detalhes-aula {
        flex-direction: column;
        gap: 10px;
    }
}
</style>
