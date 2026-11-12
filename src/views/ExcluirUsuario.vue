
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
    <div v-if="usuario">
        <h1>Excluir usuário</h1>

        <p>Deseja realmente excluir este usuário?</p>

        <p>Nome: {{ usuario.nome }}</p>
        <p>E-mail: {{ usuario.email }}</p>
        <p>Tipo: {{ usuario.tipo }}</p>

        <button @click="cancelar()">
            Cancelar
        </button>

        <button @click="excluir()">
            Excluir
        </button>
    </div>

    <div v-else>
        <p>Usuário não encontrado.</p>

        <button @click="cancelar()">
            Voltar
        </button>
    </div>
</template>
