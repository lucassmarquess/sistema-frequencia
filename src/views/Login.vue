<script setup>
    import AuthService from "../services/AuthService";
    import { useRouter } from "vue-router";
    import { ref } from "vue";
    
    const email = ref("");
    const mensagem = ref("");
    const router = useRouter();
    function login() {
        const resultado = AuthService.login(email.value);
        if (resultado === false) {
            mensagem.value = "Email incorreto";
            return;
        } 
        const tipo = AuthService.tipoUsuario();
        if (tipo === "professor") {
            router.push('/DashBoardProfessor');
        }
        if (tipo === "aluno") {
            router.push('/DashBoardAluno');
        }
    }
</script>
<template>
    <div>
        <h1>Sistema de Frequência</h1>

        <form>
            <input type="email" placeholder="E-mail" v-model="email">
            <button @click.prevent="login">Entrar</button>
        </form>
        <br>
        {{ mensagem }}
    </div>
</template>