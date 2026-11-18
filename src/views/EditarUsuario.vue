
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

import UsuarioService from '@/services/UsuarioService';
import AlunoService from '@/services/AlunoService';

import Usuario from '@/models/Usuario';
import Aluno from '@/models/Aluno';

const router = useRouter();
const route = useRoute();

const id = Number(route.params.id);

const usuario = UsuarioService.buscarPorId(id);

const mensagem = ref("");

const nome = ref(usuario ? usuario.nome : "");
const email = ref(usuario ? usuario.email : "");
const tipo = ref(usuario ? usuario.tipo : "");

function gerarNovaMatricula() {
    const alunos = AlunoService.listar();

    if (alunos.length === 0) {
        return "2000000";
    }

    const maiorMatricula = Math.max(
        ...alunos.map(aluno => Number(aluno.matricula) || 0)
    );

    return String(maiorMatricula + 1);
}

function cancelar() {
    router.push("/AdminDashBoard");
}

function atualizar() {
    mensagem.value = "";

    if (usuario === undefined) {
        mensagem.value = "Usuário não encontrado";
        return;
    }

    const nomeInformado = nome.value.trim();
    const emailInformado = email.value.trim().toLowerCase();

    if (nomeInformado === "") {
        mensagem.value = "O nome é obrigatório";
        return;
    }

    if (nomeInformado.length < 3) {
        mensagem.value = "O nome deve conter pelo menos 3 caracteres";
        return;
    }

    if (emailInformado === "") {
        mensagem.value = "O e-mail é obrigatório";
        return;
    }

    if (!emailInformado.includes("@") || !emailInformado.includes(".")) {
        mensagem.value = "E-mail inválido";
        return;
    }

    if (
        tipo.value !== "aluno" &&
        tipo.value !== "professor" &&
        tipo.value !== "admin"
    ) {
        mensagem.value = "Selecione um tipo de usuário válido";
        return;
    }

    const usuarioExistente = UsuarioService.buscarPorEmail(
        emailInformado,
        id
    );

    if (usuarioExistente !== undefined) {
        mensagem.value = "E-mail já cadastrado";
        return;
    }

    const alunoExistente = AlunoService.buscarPorId(id);

    if (tipo.value === "aluno") {

        if (alunoExistente !== undefined) {

            const alunoAtualizado = new Aluno(
                id,
                nomeInformado,
                emailInformado,
                alunoExistente.matricula,
                true
            );

            AlunoService.atualizar(id, alunoAtualizado);

        } else {

            const novaMatricula = gerarNovaMatricula();

            const novoAluno = new Aluno(
                id,
                nomeInformado,
                emailInformado,
                novaMatricula
            );

            AlunoService.cadastrar(novoAluno);
        }

    } else if (alunoExistente !== undefined) {

        const alunoAtualizado = new Aluno(
            id,
            nomeInformado,
            emailInformado,
            alunoExistente.matricula,
            false
        );

        AlunoService.atualizar(id, alunoAtualizado);
    }

    const usuarioAtualizado = new Usuario(
        id,
        nomeInformado,
        emailInformado,
        tipo.value
    );

    const resultado = UsuarioService.atualizar(
        id,
        usuarioAtualizado
    );

    if (resultado !== "Usuário atualizado com sucesso") {
        mensagem.value = resultado;
        return;
    }

    router.push("/AdminDashBoard");
}
</script>

<template>
    <main class="editar-usuario-page">

        <header class="page-header">
            <div class="brand">
                <div class="brand-icon">
                    <i class="bi bi-mortarboard-fill"></i>
                </div>

                <div>
                    <h1>Sistema de Frequência</h1>
                    <p>Painel administrativo</p>
                </div>
            </div>

            <button class="btn-back-header" @click="cancelar">
                <i class="bi bi-arrow-left"></i>
                Voltar
            </button>
        </header>

        <section class="page-content">

            <div class="welcome-section">
                <div>
                    <h2>Editar usuário</h2>
                    <p>Atualize as informações do usuário cadastrado.</p>
                </div>

                <div class="welcome-icon">
                    <i class="bi bi-person-gear"></i>
                </div>
            </div>

            <section v-if="usuario" class="form-card">

                <div class="form-heading">
                    <div class="form-heading-icon">
                        <i class="bi bi-pencil-square"></i>
                    </div>

                    <div>
                        <h3>Dados do usuário</h3>
                        <p>Altere os campos desejados e salve as modificações.</p>
                    </div>
                </div>

                <form @submit.prevent="atualizar">

                    <div class="form-group">
                        <label for="nome">
                            Nome completo
                        </label>

                        <div class="input-wrapper">
                            <i class="bi bi-person"></i>

                            <input
                                id="nome"
                                type="text"
                                v-model="nome"
                                placeholder="Digite o nome completo"
                            >
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="email">
                            E-mail
                        </label>

                        <div class="input-wrapper">
                            <i class="bi bi-envelope"></i>

                            <input
                                id="email"
                                type="email"
                                v-model="email"
                                placeholder="exemplo@email.com"
                            >
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="tipo">
                            Tipo de usuário
                        </label>

                        <div class="input-wrapper">
                            <i class="bi bi-person-badge"></i>

                            <select id="tipo" v-model="tipo">
                                <option value="aluno">Aluno</option>
                                <option value="professor">Professor</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                    </div>

                    <div v-if="tipo === 'aluno'" class="student-info">
                        <i class="bi bi-info-circle-fill"></i>

                        <span>
                            Este usuário terá um cadastro de aluno ativo.
                            Se já possuir matrícula, ela será preservada.
                        </span>
                    </div>

                    <div v-else class="student-info neutral-info">
                        <i class="bi bi-info-circle-fill"></i>

                        <span>
                            Se este usuário já possuir cadastro de aluno,
                            ele será desativado sem excluir sua matrícula
                            ou seu histórico de frequência.
                        </span>
                    </div>

                    <div v-if="mensagem" class="error-message">
                        <i class="bi bi-exclamation-circle-fill"></i>
                        {{ mensagem }}
                    </div>

                    <div class="form-actions">
                        <button
                            type="button"
                            class="btn-cancel"
                            @click="cancelar"
                        >
                            Cancelar
                        </button>

                        <button type="submit" class="btn-submit">
                            <i class="bi bi-check-circle"></i>
                            Salvar alterações
                        </button>
                    </div>

                </form>
            </section>

            <section v-else class="not-found-card">
                <div class="not-found-icon">
                    <i class="bi bi-person-x"></i>
                </div>

                <h3>Usuário não encontrado</h3>

                <p>
                    Não foi possível localizar o usuário solicitado.
                    Ele pode ter sido removido ou não existir.
                </p>

                <button class="btn-submit" @click="cancelar">
                    <i class="bi bi-arrow-left"></i>
                    Voltar ao painel
                </button>
            </section>

        </section>
    </main>
</template>

<style scoped>
.editar-usuario-page {
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
    max-width: 850px;
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

.form-card,
.not-found-card {
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

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-wrapper > i {
    position: absolute;
    left: 14px;
    color: #64748b;
    font-size: 17px;
    pointer-events: none;
}

.input-wrapper input,
.input-wrapper select {
    width: 100%;
    height: 46px;
    padding: 0 14px 0 43px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background-color: white;
    color: #334155;
    outline: none;
    transition: 0.2s;
}

.input-wrapper input:focus,
.input-wrapper select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

/* Informações */

.student-info {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px;
    margin-bottom: 20px;
    border-radius: 8px;
    background-color: #eff6ff;
    color: #1e40af;
    font-size: 13px;
    line-height: 1.5;
}

.student-info i {
    font-size: 17px;
}

.neutral-info {
    background-color: #f8fafc;
    color: #475569;
}

/* Erro */

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
    margin-top: 30px;
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

/* Usuário não encontrado */

.not-found-card {
    text-align: center;
    padding: 45px 30px;
}

.not-found-icon {
    width: 65px;
    height: 65px;
    margin: 0 auto 18px;
    border-radius: 50%;
    background-color: #fee2e2;
    color: #dc2626;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
}

.not-found-card h3 {
    color: #172554;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
}

.not-found-card p {
    color: #64748b;
    font-size: 14px;
    line-height: 1.6;
    max-width: 430px;
    margin: 0 auto 24px;
}

.not-found-card .btn-submit {
    margin: 0 auto;
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

    .form-card,
    .not-found-card {
        padding: 20px 16px;
    }

    .form-actions {
        flex-direction: column-reverse;
    }

    .btn-cancel,
    .form-actions .btn-submit {
        width: 100%;
    }
}
</style>
