<script setup>
    import AuthService from "../services/AuthService";
    import { useRouter } from "vue-router";
    import { ref } from "vue";
    import UsuarioService from "@/services/UsuarioService";

    
    const email = ref("");
    const mensagem = ref("");
    const router = useRouter();

    console.log(UsuarioService.listar());
    
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
        if (tipo === "admin") {
            router.push("/AdminDashBoard");
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