
<script setup>
import AuthService from "../services/AuthService";
import { useRouter } from "vue-router";
import { ref } from "vue";

const email = ref("");
const mensagem = ref("");

const router = useRouter();

function login() {
    mensagem.value = "";

    const resultado = AuthService.login(email.value.trim());

    if (resultado === false) {
        mensagem.value = "E-mail incorreto. Verifique e tente novamente.";
        return;
    }

    const tipo = AuthService.tipoUsuario();

    if (tipo === "professor") {
        router.push("/DashBoardProfessor");
    } else if (tipo === "aluno") {
        router.push("/DashBoardAluno");
    } else if (tipo === "admin") {
        router.push("/AdminDashBoard");
    }
}
</script>

<template>
    <main class="login-page">
        <section class="login-card">

            <div class="login-header">
                <div class="login-icon">
                    <i class="bi bi-mortarboard-fill"></i>
                </div>

                <h1>Sistema de Frequência</h1>
                <p>Faça login para acessar sua conta</p>
            </div>

            <form @submit.prevent="login">

                <div class="mb-3">
                    <label for="email" class="form-label">
                        E-mail
                    </label>

                    <input
                        id="email"
                        type="email"
                        class="form-control login-input"
                        placeholder="Digite seu e-mail"
                        v-model="email"
                        autocomplete="email"
                        required
                    >
                </div>

                <p
                    v-if="mensagem"
                    class="login-error"
                    role="alert"
                >
                    <i class="bi bi-exclamation-circle-fill"></i>
                    {{ mensagem }}
                </p>

                <button type="submit" class="btn login-button w-100">
                    Entrar
                    <i class="bi bi-arrow-right ms-2"></i>
                </button>

            </form>

            <div class="login-footer">
                Sistema de Frequência Estudantil
            </div>

        </section>
    </main>
</template>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    background: linear-gradient(135deg, #172554, #2563eb);
}

.login-card {
    width: 100%;
    max-width: 420px;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
}

.login-header {
    text-align: center;
    margin-bottom: 32px;
}

.login-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #dbeafe;
    color: #2563eb;
    border-radius: 16px;
    font-size: 30px;
}

.login-header h1 {
    color: #172554;
    font-size: 25px;
    font-weight: 700;
    margin-bottom: 8px;
}

.login-header p {
    color: #64748b;
    font-size: 14px;
    margin: 0;
}

.login-card .form-label {
    color: #334155;
    font-weight: 600;
}

.login-input {
    padding: 12px 14px;
    border-color: #cbd5e1;
    border-radius: 8px;
}

.login-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.login-error {
    color: #dc2626;
    font-size: 14px;
    margin-bottom: 16px;
}

.login-button {
    padding: 12px;
    margin-top: 8px;
    background-color: #2563eb;
    color: #ffffff;
    font-weight: 600;
    border-radius: 8px;
    transition: background-color 0.2s;
}

.login-button:hover {
    background-color: #1d4ed8;
    color: #ffffff;
}

.login-footer {
    margin-top: 28px;
    padding-top: 18px;
    border-top: 1px solid #e2e8f0;
    text-align: center;
    color: #94a3b8;
    font-size: 12px;
}

@media (max-width: 480px) {
    .login-card {
        padding: 28px 22px;
    }

    .login-header h1 {
        font-size: 22px;
    }
}
</style>
