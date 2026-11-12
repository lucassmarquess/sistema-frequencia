
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

        // Se o usuário está se tornando aluno.
        if (tipo.value === "aluno") {

            if (alunoExistente !== undefined) {

                // Reativa o cadastro e preserva a matrícula.
                const alunoAtualizado = new Aluno(
                    id,
                    nomeInformado,
                    emailInformado,
                    alunoExistente.matricula,
                    true
                );

                AlunoService.atualizar(id, alunoAtualizado);

            } else {

                // Cria um cadastro novo para quem nunca foi aluno.
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

            // Se deixou de ser aluno, desativa sem excluir o histórico.
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
    <h1>Editar Usuário</h1>

    <div v-if="usuario">
        <label>Nome:</label><br>
        <input type="text" v-model="nome"><br>

        <label>E-mail:</label><br>
        <input type="email" v-model="email"><br>

        <label>Tipo:</label><br>

        <select v-model="tipo">
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
            <option value="admin">Admin</option>
        </select>

        <br><br>

        <button @click="cancelar()">Cancelar</button>
        <button @click="atualizar()">Salvar</button>

        <p>{{ mensagem }}</p>
    </div>

    <div v-else>
        <p>Usuário não encontrado.</p>
        <button @click="cancelar()">Voltar</button>
    </div>
</template>
