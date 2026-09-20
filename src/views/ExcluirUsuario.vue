<script setup>
    import { useRoute } from 'vue-router';
    import { useRouter } from 'vue-router';
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
        if (usuario.tipo === "aluno") {
            const presencas = PresencaService.listar();
            const novaPresenca = presencas.filter(presenca =>
                presenca.alunoId != id);
            StorageService.atualizar("presencas", novaPresenca);
            AlunoService.remover(id);
        }
        UsuarioService.remover(id);
        router.push("/AdminDashBoard");
    }
</script>
<template>
    <p>Deseja realmente excluir esse Usuário?</p>
    <p>{{ usuario.nome }}</p>
    <p>{{ usuario.email }}</p>
    <p>{{ usuario.tipo }}</p>
    <button @click="cancelar()">Cancelar</button>
    <button @click="excluir()">Excluir</button>

</template>