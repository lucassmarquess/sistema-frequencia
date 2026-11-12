
<script setup>
    import { useRouter } from 'vue-router';
    import { ref, computed } from 'vue';

    import AuthService from '@/services/AuthService';
    import UsuarioService from '@/services/UsuarioService';
    import AlunoService from '@/services/AlunoService';

    const tabela = ref("todos");
    const busca = ref("");

    const usuarios = UsuarioService.listar();

    const totalUsuario = usuarios.length;
    const alunos = UsuarioService.buscaPorTipo("aluno");
    const professores = UsuarioService.buscaPorTipo("professor");
    const admins = UsuarioService.buscaPorTipo("admin");

    const router = useRouter();

    function logout() {
        AuthService.logout();
        router.push("/");
    }

    function pegarMatricula(id) {
        const aluno = AlunoService.buscarPorId(id);

        if (aluno === undefined) {
            return "--/--";
        }

        return aluno.matricula;
    }

    // Retorna os usuários conforme o filtro e a busca.
    const usuariosExibidos = computed(() => {
        let resultado = usuarios;

        if (tabela.value !== "todos") {
            resultado = resultado.filter(
                usuario => usuario.tipo === tabela.value
            );
        }

        const termo = busca.value.trim().toLowerCase();

        if (termo !== "") {
            resultado = resultado.filter(usuario =>
                usuario.nome.toLowerCase().includes(termo) ||
                usuario.email.toLowerCase().includes(termo)
            );
        }

        return resultado;
    });

    function criarUsuario() {
        router.push("/CriarUsuario");
    }

    function editarUsuario(id) {
        router.push(`/EditarUsuario/${id}`);
    }

    function excluirUsuario(id) {
        router.push(`/ExcluirUsuario/${id}`);
    }
</script>

<template>
    <h1>Sistema de Frequência</h1>

    <button @click="logout()">Sair</button>

    <p>Olá, Administrador</p>

    <div class="container">
        <div>
            <p>Usuários</p>
            <p>{{ totalUsuario }}</p>
        </div>

        <div>
            <p>Alunos</p>
            <p>{{ alunos.length }}</p>
        </div>

        <div>
            <p>Professores</p>
            <p>{{ professores.length }}</p>
        </div>

        <div>
            <p>Administradores</p>
            <p>{{ admins.length }}</p>
        </div>
    </div>

    <p>Usuários</p>

    <button @click="criarUsuario()">
        + Novo Usuário
    </button>

    <br><br>

    <label>Filtro:</label>

    <select v-model="tabela">
        <option value="todos">Todos</option>
        <option value="professor">Professor</option>
        <option value="aluno">Aluno</option>
        <option value="admin">Admin</option>
    </select>

    <label>Buscar:</label>

    <input
        type="text"
        v-model="busca"
        placeholder="Nome ou e-mail"
    >

    <table>
        <thead>
            <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Tipo</th>
                <th>Matrícula</th>
                <th>Ações</th>
            </tr>
        </thead>

        <tbody>
            <tr
                v-for="usuario in usuariosExibidos"
                :key="usuario.id"
            >
                <td>{{ usuario.id }}</td>
                <td>{{ usuario.nome }}</td>
                <td>{{ usuario.email }}</td>
                <td>{{ usuario.tipo }}</td>

                <td>
                    <span v-if="usuario.tipo === 'aluno'">
                        {{ pegarMatricula(usuario.id) }}
                    </span>

                    <span v-else>
                        --/--
                    </span>
                </td>

                <td>
                    <button @click="editarUsuario(usuario.id)">
                        Editar
                    </button>

                    <button @click="excluirUsuario(usuario.id)">
                        Excluir
                    </button>
                </td>
            </tr>

            <tr v-if="usuariosExibidos.length === 0">
                <td colspan="6">
                    Nenhum usuário encontrado.
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style>
    div {
        display: inline;
        margin-right: 10px;
    }

    .container {
        display: flex;
    }
</style>
