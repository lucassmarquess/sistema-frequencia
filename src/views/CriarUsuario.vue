<script setup>
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';
    import UsuarioService from '@/services/UsuarioService';
    import AlunoService from '@/services/AlunoService';
    import Usuario from '@/models/Usuario';
    import Aluno from '@/models/Aluno';

    const router = useRouter();

    const mensagem = ref("");
    const nome = ref("");
    const email = ref("");
    const tipo = ref("");

    const usuarios = UsuarioService.listar();
    const ultimoUsuario = usuarios.at(-1);
    const novoId = ultimoUsuario.id + 1;

    const alunos = AlunoService.listar();
    let matricula;
    if (alunos.length === 0) {
        matricula = "2000000";
    }
    else {
        const ultimoAluno = alunos.at(-1);
        matricula = Number(ultimoAluno.matricula) + 1;
    }

    function cancelar() {
        router.push("/AdminDashBoard");
    }
    function duplicidade(email) {
        const jaExiste = usuarios.some(usuario => usuario.email === email);
        return jaExiste;
    }
    function cadastrar() {
        if (nome.value.trim() === "") {
            mensagem.value = "O nome é obrigatório";
            return;
        }
        if (nome.value.trim().length < 3) {
            mensagem.value = "O nome deve conter pelo menos 3 caracteres";
            return;
        }
        if (email.value.trim() === "") {
            mensagem.value = "O E-mail é obrigatório";
            return;
        }
        if (!email.value.includes("@") || !email.value.includes(".")) {
            mensagem.value = "E-mail inválido";
            return;
        }
        if (duplicidade(email.value) === true) {
            mensagem.value = "E-mail já cadastrado";
            return;
        }
        if (tipo.value === "aluno") {
            AlunoService.cadastrar(
                new Aluno(novoId, nome.value, email.value, matricula)
            );
        }
        UsuarioService.cadastrar(
            new Usuario(novoId, nome.value, email.value, tipo.value)
        );
        router.push("/AdminDashBoard");
    }
</script>
<template>
    <h1>Novo Usuário</h1>
    <label>Nome:</label><br>
    <input type="text" v-model="nome"><br>
    <label>Email:</label><br>
    <input type="text" v-model="email"><br>
    <label>Tipo:</label><br>
    <select v-model="tipo">
        <option value="aluno">Aluno</option>
        <option value="professor">Professor</option>
        <option value="admin">Admin</option>
    </select><br><br>
    <button @click="cancelar()">Cancelar</button>
    <button @click="cadastrar()">Cadastrar</button>
    <p>{{ mensagem }}</p>
</template>