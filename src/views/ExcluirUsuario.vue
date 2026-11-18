
<script setup>
import { useRoute, useRouter } from 'vue-router';

import UsuarioService from '@/services/UsuarioService';
import AlunoService from '@/services/AlunoService';
import PresencaService from '@/services/PresencaService';
import StorageService from '@/services/StorageService';

const router = useRouter();
const route = useRoute();

const id = Number(route.params.id);

const usuario = UsuarioService.buscarPorId(id);

function cancelar() {
    router.push("/AdminDashBoard");
}

function excluir() {
    if (usuario === undefined) {
        router.push("/AdminDashBoard");
        return;
    }

    // Verifica se existe um cadastro de aluno,
    // mesmo que atualmente o usuário tenha outro tipo.
    const aluno = AlunoService.buscarPorId(id);

    if (aluno !== undefined) {
        // Remove todas as presenças relacionadas ao aluno.
        const presencas = PresencaService.listar();

        const novasPresencas = presencas.filter(
            presenca => presenca.alunoId !== id
        );

        StorageService.atualizar("presencas", novasPresencas);

        // Remove definitivamente o cadastro de aluno.
        AlunoService.remover(id);
    }

    // Remove o cadastro de usuário.
    UsuarioService.remover(id);

    router.push("/AdminDashBoard");
}
</script>

<template>
    <main class="excluir-container">
        <section v-if="usuario" class="excluir-card">

            <div class="icone-alerta">
                <i class="bi bi-exclamation-triangle-fill"></i>
            </div>

            <h1>Excluir usuário</h1>

            <p class="descricao">
                Você está prestes a excluir este usuário.
                Essa ação não poderá ser desfeita.
            </p>

            <div class="usuario-info">
                <div class="info-item">
                    <span>Nome</span>
                    <strong>{{ usuario.nome }}</strong>
                </div>

                <div class="info-item">
                    <span>E-mail</span>
                    <strong>{{ usuario.email }}</strong>
                </div>

                <div class="info-item">
                    <span>Tipo de usuário</span>
                    <strong class="tipo-usuario">
                        {{ usuario.tipo }}
                    </strong>
                </div>
            </div>

            <div class="aviso">
                <i class="bi bi-info-circle-fill"></i>
                <span>
                    Caso exista um cadastro de aluno, suas informações
                    e registros de presença também serão removidos.
                </span>
            </div>

            <div class="acoes">
                <button
                    class="btn-cancelar"
                    @click="cancelar()"
                >
                    <i class="bi bi-arrow-left"></i>
                    Cancelar
                </button>

                <button
                    class="btn-excluir"
                    @click="excluir()"
                >
                    <i class="bi bi-trash3-fill"></i>
                    Excluir usuário
                </button>
            </div>
        </section>

        <section v-else class="excluir-card nao-encontrado">
            <div class="icone-alerta neutro">
                <i class="bi bi-person-x-fill"></i>
            </div>

            <h1>Usuário não encontrado</h1>

            <p class="descricao">
                Não foi possível localizar o usuário solicitado.
                Ele pode já ter sido removido do sistema.
            </p>

            <button
                class="btn-voltar"
                @click="cancelar()"
            >
                <i class="bi bi-arrow-left"></i>
                Voltar ao painel
            </button>
        </section>
    </main>
</template>

<style scoped>
.excluir-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 20px;
}

.excluir-card {
    width: 100%;
    max-width: 520px;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
    text-align: center;
}

.icone-alerta {
    width: 68px;
    height: 68px;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #fee2e2;
    color: #dc2626;
    font-size: 30px;
}

.icone-alerta.neutro {
    background-color: #e2e8f0;
    color: #64748b;
}

.excluir-card h1 {
    margin-bottom: 12px;
    color: #172554;
    font-size: 25px;
    font-weight: 700;
}

.descricao {
    margin-bottom: 28px;
    color: #64748b;
    font-size: 14px;
    line-height: 1.6;
}

.usuario-info {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    text-align: left;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px 0;
}

.info-item:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
}

.info-item span {
    color: #64748b;
    font-size: 12px;
}

.info-item strong {
    color: #334155;
    font-size: 14px;
    overflow-wrap: anywhere;
}

.tipo-usuario {
    text-transform: capitalize;
}

.aviso {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 13px;
    margin-bottom: 25px;
    background-color: #fff7ed;
    border: 1px solid #fed7aa;
    border-radius: 8px;
    color: #9a3412;
    font-size: 12px;
    line-height: 1.5;
    text-align: left;
}

.aviso i {
    margin-top: 2px;
    font-size: 15px;
}

.acoes {
    display: flex;
    gap: 12px;
}

.acoes button,
.btn-voltar {
    min-height: 44px;
    padding: 11px 18px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
}

.acoes button {
    flex: 1;
}

.btn-cancelar {
    background-color: #e2e8f0;
    color: #334155;
}

.btn-cancelar:hover {
    background-color: #cbd5e1;
}

.btn-excluir {
    background-color: #dc2626;
    color: #ffffff;
}

.btn-excluir:hover {
    background-color: #b91c1c;
}

.btn-voltar {
    background-color: #2563eb;
    color: #ffffff;
}

.btn-voltar:hover {
    background-color: #1d4ed8;
}

.acoes button i,
.btn-voltar i {
    margin-right: 5px;
}

@media (max-width: 480px) {
    .excluir-card {
        padding: 28px 20px;
    }

    .excluir-card h1 {
        font-size: 22px;
    }

    .acoes {
        flex-direction: column;
    }
}
</style>
