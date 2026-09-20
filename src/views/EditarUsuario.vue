<script setup>
    import { useRoute } from 'vue-router';
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';
    import UsuarioService from '@/services/UsuarioService';
    import Usuario from '@/models/Usuario';
    import AlunoService from '@/services/AlunoService';
    import Aluno from '@/models/Aluno';

    const router = useRouter();

    const mensagem = ref("");

    const route = useRoute();
    const id = Number(route.params.id);
    const usuario = UsuarioService.buscarPorId(id);

    const nome = ref(usuario.nome);
    const email = ref(usuario.email);
    const tipo = ref(usuario.tipo);

    const usuarios = UsuarioService.listar();

    function duplicidade(email) {
        const jaExiste = usuarios.some(usuario => 
            usuario.email === email &&
            usuario.id !== id);
        return jaExiste;
    }

    function cancelar() {
        router.push("/AdminDashBoard");
    }
    
    function atualizar() {
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
            const aluno = AlunoService.buscarPorId(id);
            console.log("Antes:", AlunoService.listar());
            AlunoService.atualizar(id,
                new Aluno(id, nome.value, email.value, aluno.matricula)
            );
        }
        UsuarioService.atualizar(id,
            new Usuario(id, nome.value, email.value, tipo.value)
        );
        console.log("Depois:", AlunoService.listar());
        router.push("/AdminDashBoard");
    }
</script>

<template>
    <h1>Editar Usuário</h1>
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
    <button @click="atualizar()">Salvar</button>
    <p>{{ mensagem }}</p>
</template>