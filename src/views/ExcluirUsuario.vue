<script setup>
    import { useRoute } from 'vue-router';
    import { useRouter } from 'vue-router';
    import UsuarioService from '@/services/UsuarioService';

    const router = useRouter();

    const route = useRoute();
    const id = Number(route.params.id);
    const usuario = UsuarioService.buscarPorId(id);
    function cancelar() {
        router.push("/AdminDashBoard");
    }
</script>
<template>
    <p>Deseja realmente excluir esse Usuário?</p>
    <p>{{ usuario.nome }}</p>
    <p>{{ usuario.email }}</p>
    <p>{{ usuario.tipo }}</p>
    <button @click="cancelar()">Cancelar</button>
    <button>Excluir</button>

</template>