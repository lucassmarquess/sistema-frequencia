
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

    // Gera um ID considerando todos os usuários cadastrados.
    function gerarNovoId() {
        const usuarios = UsuarioService.listar();

        if (usuarios.length === 0) {
            return 1;
        }

        return Math.max(
            ...usuarios.map(usuario => Number(usuario.id) || 0)
        ) + 1;
    }

    // Gera a próxima matrícula considerando todos os alunos.
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

    function cadastrar() {
        mensagem.value = "";

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

        if (tipo.value === "") {
            mensagem.value = "Selecione o tipo de usuário";
            return;
        }

        const novoId = gerarNovoId();

        if (tipo.value === "aluno") {
            const matricula = gerarNovaMatricula();

            AlunoService.cadastrar(
                new Aluno(
                    novoId,
                    nomeInformado,
                    emailInformado,
                    matricula
                )
            );
        }

        const novoUsuario = new Usuario(
            novoId,
            nomeInformado,
            emailInformado,
            tipo.value
        );

        const cadastro = UsuarioService.cadastrar(novoUsuario);

        if (cadastro !== "Usuário cadastrado com sucesso") {
            mensagem.value = cadastro;
            return;
        }

        router.push("/AdminDashBoard");
    }
</script>

<template>
    <h1>Novo Usuário</h1>

    <label>Nome:</label><br>
    <input type="text" v-model="nome"><br>

    <label>E-mail:</label><br>
    <input type="email" v-model="email"><br>

    <label>Tipo:</label><br>

    <select v-model="tipo">
        <option value="" disabled>Selecione</option>
        <option value="aluno">Aluno</option>
        <option value="professor">Professor</option>
        <option value="admin">Admin</option>
    </select>

    <br><br>

    <button @click="cancelar()">Cancelar</button>
    <button @click="cadastrar()">Cadastrar</button>

    <p>{{ mensagem }}</p>
</template>
