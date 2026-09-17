<script setup>
    import { useRouter } from 'vue-router';

    const router = useRouter();

    function cancelar() {
        router.push("/AdminDashBoard");
    }
</script>
<template>
    <h1>Novo Usuário</h1>
    <label>Nome:</label><br>
    <input type="text" name="nome"><br>
    <label>Email:</label><br>
    <input type="text" name="nome"><br>
    <label>Tipo:</label><br>
    <select>
        <option value="aluno">Aluno</option>
        <option value="professor">Professor</option>
        <option value="admin">Admin</option>
    </select><br><br>
    <button @click="cancelar()">Cancelar</button>
    <button>Cadastrar</button>
</template>