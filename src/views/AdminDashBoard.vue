<script setup>
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';
    import AuthService from '@/services/AuthService';
    import UsuarioService from '@/services/UsuarioService';
    import AlunoService from '@/services/AlunoService';

    const tabela = ref("todos");
    const busca = ref("");
    const resultado = ref("");
    
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
        return aluno.matricula;
    }
    function buscarUsuario() {
        const termo = busca.value.toLowerCase().trim();
        resultado.value = usuarios.filter(usuario => {
            return (
                usuario.nome.toLowerCase().includes(termo) ||
                usuario.email.toLowerCase().includes(termo)
            );
        });
        return resultado;   
    }
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
        <div><p>Usuários</p><p>{{ totalUsuario }}</p></div>
        <div><p>Alunos</p><p>{{ alunos.length }}</p></div>
        <div><p>Professor</p><p>{{ professores.length }}</p></div>
        <div><p>Admin</p><p>{{ admins.length }}</p></div>
    </div>
    <p>Usuários</p>
    <button @click="criarUsuario()">+ Novo Usuário</button><br>
    Filtro: 
    <select v-model="tabela">
        <option value="todos">Todos</option>
        <option value="professor">Professor</option>
        <option value="aluno">Aluno</option>
        <option value="admin">Admin</option>
    </select>
    Buscar:
    <input type="text" v-model="busca" placeholder="Nome ou email">
    <button @click="buscarUsuario()">Buscar</button>

    <table>
        <thead>
            <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Tipo</th>
                <th>Matricula</th>
                <th>Ações</th>
            </tr>
        </thead>

        <tbody v-if="resultado != ''">
            <tr v-for="usuario in resultado" :key="usuario.id">
                <td>{{ usuario.id }}</td>
                <td>{{ usuario.nome }}</td>
                <td>{{ usuario.email }}</td>
                <td>{{ usuario.tipo }}</td>
                <td><p>--/--</p></td>
                <td><button @click="editarUsuario(usuario.id)">Editar</button></td>
                <td><button @click="excluirUsuario(usuario.id)">Excluir</button></td>
            </tr>
        </tbody>
        <tbody v-else-if="tabela === 'todos'">
            <tr v-for="usuario in usuarios" :key="usuario.id">
                <td>{{ usuario.id }}</td>
                <td>{{ usuario.nome }}</td>
                <td>{{ usuario.email }}</td>
                <td>{{ usuario.tipo }}</td>
                <td v-if="usuario.tipo === 'aluno'">
                    {{ pegarMatricula(usuario.id) }}
                </td>
                <td v-else>
                    <p>--/--</p>
                </td>
                <td><button @click="editarUsuario(usuario.id)">Editar</button></td>
                <td><button @click="excluirUsuario(usuario.id)">Excluir</button></td>
            </tr>
        </tbody>
        <tbody v-else-if="tabela === 'professor'">
            <tr v-for="professor in professores" :key="professor.id">
                <td>{{ professor.id }}</td>
                <td>{{ professor.nome }}</td>
                <td>{{ professor.email }}</td>
                <td>{{ professor.tipo }}</td>
                <td><p>--/--</p></td>
                <td><button @click="editarUsuario(professor.id)">Editar</button></td>
                <td><button @click="excluirUsuario(professor.id)">Excluir</button></td>
            </tr>
        </tbody>
        <tbody v-else-if="tabela === 'aluno'">
            <tr v-for="aluno in alunos" :key="aluno.id">
                <td>{{ aluno.id }}</td>
                <td>{{ aluno.nome }}</td>
                <td>{{ aluno.email }}</td>
                <td>{{ aluno.tipo }}</td>
                <td>{{ pegarMatricula(aluno.id) }}</td>
                <td><button @click="editarUsuario(aluno.id)">Editar</button></td>
                <td><button @click="excluirUsuario(aluno.id)"">Excluir</button></td>
            </tr>
        </tbody>
        <tbody v-else-if="tabela === 'admin'">
            <tr v-for="admin in admins" :key="admin.id">
                <td>{{ admin.id }}</td>
                <td>{{ admin.nome }}</td>
                <td>{{ admin.email }}</td>
                <td>{{ admin.tipo }}</td>
                <td><p>--/--</p></td>
                <td><button @click="editarUsuario(admin.id)">Editar</button></td>
                <td><button @click="excluirUsuario(admin.id)">Excluir</button></td>
            </tr>
        </tbody>
    </table>
</template>
<style>
    div{
        display: inline;
        margin-right: 10px;
    }
    .container{
        display: flex;
    }
</style>