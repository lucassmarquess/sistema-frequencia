<script setup>
    import UsuarioService from '@/services/UsuarioService';
    import { useRoute } from 'vue-router';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const route = useRoute();
    const id = Number(route.params.id);
    const usuario = UsuarioService.buscarPorId(id);
    function cancelar() {
        router.push("/AdminDashBoard");
    }
</script>

<template>
    <h1>Editar Usuário</h1>
    <label>Nome:</label><br>
    <input type="text" :value="usuario.nome"><br>
    <label>Email:</label><br>
    <input type="text" :value="usuario.email"><br>
    <label>Tipo:</label><br>
    <select :value="usuario.tipo"> 
        <option value="aluno">Aluno</option>
        <option value="professor">Professor</option>
        <option value="admin">Admin</option>
    </select><br><br>
    <button @click="cancelar()">Cancelar</button>
    <button>Salvar</button>
</template>