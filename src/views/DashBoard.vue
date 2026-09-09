<script setup>
    import { useRouter } from 'vue-router';
    import AuthService from '../services/AuthService';

    const router = useRouter();
    const usuario = AuthService.usuarioLogado();
    function logout() {
        AuthService.logout();
        router.push('/');
    }
</script>
<template>
    <h1>Sistema de Frequência</h1>
    <p>Olá, {{ usuario.nome }}</p>
    <p>Tipo de Usuário: {{ usuario.tipo }}</p>
    <button @click="logout">Sair</button>
</template>