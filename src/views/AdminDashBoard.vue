
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
    <main class="admin-dashboard">

        <header class="admin-header">
            <div class="admin-brand">
                <div class="admin-logo">
                    <i class="bi bi-mortarboard-fill"></i>
                </div>

                <div>
                    <h1>Sistema de Frequência</h1>
                    <p>Painel administrativo</p>
                </div>
            </div>

            <button class="btn-logout" @click="logout">
                <i class="bi bi-box-arrow-right"></i>
                Sair
            </button>
        </header>

        <section class="admin-content">

            <div class="welcome-section">
                <div>
                    <h2>Olá, Administrador!</h2>
                    <p>Gerencie os usuários do sistema.</p>
                </div>

                <div class="welcome-icon">
                    <i class="bi bi-person-gear"></i>
                </div>
            </div>

            <section class="stats-grid">

                <article class="stat-card">
                    <div class="stat-icon blue">
                        <i class="bi bi-people-fill"></i>
                    </div>

                    <div>
                        <p>Total de usuários</p>
                        <h3>{{ totalUsuario }}</h3>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-icon green">
                        <i class="bi bi-mortarboard-fill"></i>
                    </div>

                    <div>
                        <p>Alunos</p>
                        <h3>{{ alunos.length }}</h3>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-icon purple">
                        <i class="bi bi-person-video3"></i>
                    </div>

                    <div>
                        <p>Professores</p>
                        <h3>{{ professores.length }}</h3>
                    </div>
                </article>

                <article class="stat-card">
                    <div class="stat-icon orange">
                        <i class="bi bi-shield-lock-fill"></i>
                    </div>

                    <div>
                        <p>Administradores</p>
                        <h3>{{ admins.length }}</h3>
                    </div>
                </article>

            </section>

            <section class="users-section">

                <div class="section-header">
                    <div>
                        <h2>Usuários cadastrados</h2>
                        <p>Consulte e gerencie os usuários do sistema.</p>
                    </div>

                    <button class="btn-create" @click="criarUsuario">
                        <i class="bi bi-plus-lg"></i>
                        Novo usuário
                    </button>
                </div>

                <div class="filters-container">

                    <div class="filter-group">
                        <label for="filtro-tipo">
                            <i class="bi bi-funnel"></i>
                            Filtrar por tipo
                        </label>

                        <select id="filtro-tipo" v-model="tabela">
                            <option value="todos">Todos os usuários</option>
                            <option value="professor">Professores</option>
                            <option value="aluno">Alunos</option>
                            <option value="admin">Administradores</option>
                        </select>
                    </div>

                    <div class="filter-group search-group">
                        <label for="busca-usuario">
                            <i class="bi bi-search"></i>
                            Buscar usuário
                        </label>

                        <input
                            id="busca-usuario"
                            type="text"
                            v-model="busca"
                            placeholder="Digite um nome ou e-mail..."
                        >
                    </div>

                </div>

                <div class="table-container">
                    <table class="users-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Tipo</th>
                                <th>Matrícula</th>
                                <th class="actions-column">Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="usuario in usuariosExibidos"
                                :key="usuario.id"
                            >
                                <td class="user-id">#{{ usuario.id }}</td>

                                <td class="user-name">
                                    {{ usuario.nome }}
                                </td>

                                <td class="user-email">
                                    {{ usuario.email }}
                                </td>

                                <td>
                                    <span
                                        class="type-badge"
                                        :class="`type-${usuario.tipo}`"
                                    >
                                        {{ usuario.tipo }}
                                    </span>
                                </td>

                                <td>
                                    <span v-if="usuario.tipo === 'aluno'">
                                        {{ pegarMatricula(usuario.id) }}
                                    </span>

                                    <span v-else class="empty-value">
                                        --/--
                                    </span>
                                </td>

                                <td>
                                    <div class="action-buttons">
                                        <button
                                            class="btn-edit"
                                            @click="editarUsuario(usuario.id)"
                                            title="Editar usuário"
                                        >
                                            <i class="bi bi-pencil-square"></i>
                                            Editar
                                        </button>

                                        <button
                                            class="btn-delete"
                                            @click="excluirUsuario(usuario.id)"
                                            title="Excluir usuário"
                                        >
                                            <i class="bi bi-trash3"></i>
                                            Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <tr v-if="usuariosExibidos.length === 0">
                                <td colspan="6" class="empty-table">
                                    <i class="bi bi-search"></i>
                                    <strong>Nenhum usuário encontrado.</strong>
                                    <span>Tente alterar os filtros ou a busca.</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="table-footer">
                    <span>
                        Exibindo {{ usuariosExibidos.length }}
                        de {{ totalUsuario }} usuários
                    </span>
                </div>

            </section>

        </section>
    </main>
</template>

<style scoped>
.admin-dashboard {
    min-height: 100vh;
    background-color: #f1f5f9;
}

/* Cabeçalho */

.admin-header {
    background-color: #172554;
    color: white;
    padding: 20px 6%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
}

.admin-brand {
    display: flex;
    align-items: center;
    gap: 14px;
}

.admin-logo {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
}

.admin-brand h1 {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
}

.admin-brand p {
    color: #cbd5e1;
    font-size: 13px;
    margin: 4px 0 0;
}

.btn-logout {
    border: 1px solid #64748b;
    background: transparent;
    color: white;
    padding: 10px 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: 0.2s;
}

.btn-logout:hover {
    background-color: #dc2626;
    border-color: #dc2626;
}

/* Conteúdo */

.admin-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 35px 5%;
}

.welcome-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
}

.welcome-section h2 {
    color: #172554;
    font-size: 25px;
    font-weight: 700;
    margin: 0 0 7px;
}

.welcome-section p {
    color: #64748b;
    margin: 0;
}

.welcome-icon {
    width: 55px;
    height: 55px;
    border-radius: 15px;
    background-color: #dbeafe;
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 27px;
}

/* Indicadores */

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin-bottom: 35px;
}

.stat-card {
    background-color: white;
    border-radius: 12px;
    padding: 22px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}

.stat-icon {
    width: 48px;
    height: 48px;
    min-width: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
}

.stat-icon.blue {
    background-color: #dbeafe;
    color: #2563eb;
}

.stat-icon.green {
    background-color: #dcfce7;
    color: #16a34a;
}

.stat-icon.purple {
    background-color: #f3e8ff;
    color: #9333ea;
}

.stat-icon.orange {
    background-color: #ffedd5;
    color: #ea580c;
}

.stat-card p {
    color: #64748b;
    font-size: 13px;
    margin: 0 0 5px;
}

.stat-card h3 {
    color: #172554;
    font-size: 25px;
    font-weight: 700;
    margin: 0;
}

/* Seção de usuários */

.users-section {
    background-color: white;
    border-radius: 14px;
    padding: 26px;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 25px;
}

.section-header h2 {
    color: #172554;
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 6px;
}

.section-header p {
    color: #64748b;
    font-size: 14px;
    margin: 0;
}

.btn-create {
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 11px 17px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    transition: 0.2s;
}

.btn-create:hover {
    background-color: #1d4ed8;
}

/* Filtros */

.filters-container {
    display: flex;
    gap: 20px;
    margin-bottom: 22px;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 230px;
}

.filter-group label {
    color: #334155;
    font-size: 13px;
    font-weight: 600;
}

.filter-group label i {
    margin-right: 5px;
    color: #2563eb;
}

.filter-group select,
.filter-group input {
    width: 100%;
    height: 42px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 0 12px;
    background-color: white;
    color: #334155;
    outline: none;
}

.filter-group select:focus,
.filter-group input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.search-group {
    flex: 1;
}

/* Tabela */

.table-container {
    width: 100%;
    overflow-x: auto;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
}

.users-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    white-space: nowrap;
}

.users-table thead {
    background-color: #f8fafc;
}

.users-table th {
    color: #475569;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 15px 14px;
    border-bottom: 1px solid #e2e8f0;
}

.users-table td {
    color: #475569;
    font-size: 13px;
    padding: 15px 14px;
    border-bottom: 1px solid #f1f5f9;
}

.users-table tbody tr:last-child td {
    border-bottom: none;
}

.users-table tbody tr:hover {
    background-color: #f8fafc;
}

.user-id {
    color: #64748b !important;
    font-weight: 600;
}

.user-name {
    color: #172554 !important;
    font-weight: 600;
}

.user-email {
    color: #64748b !important;
}

.empty-value {
    color: #94a3b8;
}

/* Identificação do tipo */

.type-badge {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: capitalize;
}

.type-aluno {
    background-color: #dcfce7;
    color: #15803d;
}

.type-professor {
    background-color: #dbeafe;
    color: #1d4ed8;
}

.type-admin {
    background-color: #f3e8ff;
    color: #7e22ce;
}

/* Ações */

.actions-column {
    text-align: center;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
}

.btn-edit,
.btn-delete {
    border: none;
    border-radius: 6px;
    padding: 7px 10px;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    transition: 0.2s;
}

.btn-edit {
    background-color: #dbeafe;
    color: #1d4ed8;
}

.btn-edit:hover {
    background-color: #bfdbfe;
}

.btn-delete {
    background-color: #fee2e2;
    color: #dc2626;
}

.btn-delete:hover {
    background-color: #fecaca;
}

/* Tabela vazia */

.empty-table {
    text-align: center !important;
    padding: 40px 15px !important;
}

.empty-table i {
    display: block;
    color: #94a3b8;
    font-size: 28px;
    margin-bottom: 10px;
}

.empty-table strong,
.empty-table span {
    display: block;
}

.empty-table strong {
    color: #334155;
    margin-bottom: 5px;
}

.empty-table span {
    color: #94a3b8;
    font-size: 12px;
}

/* Rodapé */

.table-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 15px;
    color: #64748b;
    font-size: 12px;
}

/* Responsividade */

@media (max-width: 1000px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 650px) {
    .admin-header {
        padding: 16px 5%;
    }

    .admin-brand h1 {
        font-size: 16px;
    }

    .admin-logo {
        width: 42px;
        height: 42px;
        font-size: 21px;
    }

    .btn-logout {
        padding: 9px 11px;
        font-size: 13px;
    }

    .admin-content {
        padding: 25px 4%;
    }

    .welcome-section h2 {
        font-size: 21px;
    }

    .stats-grid {
        gap: 12px;
    }

    .stat-card {
        padding: 15px 12px;
        gap: 10px;
    }

    .stat-icon {
        width: 38px;
        height: 38px;
        min-width: 38px;
        font-size: 18px;
    }

    .stat-card p {
        font-size: 11px;
    }

    .stat-card h3 {
        font-size: 21px;
    }

    .users-section {
        padding: 18px 14px;
    }

    .section-header {
        align-items: flex-start;
        flex-direction: column;
    }

    .filters-container {
        flex-direction: column;
    }

    .filter-group {
        width: 100%;
    }

    .btn-create {
        width: 100%;
        justify-content: center;
    }
}
</style>
