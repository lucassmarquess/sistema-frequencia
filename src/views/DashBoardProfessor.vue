<script setup>
    import { useRouter } from 'vue-router';
    import AlunoService from '@/services/AlunoService';
    import AulaService from '@/services/AulaService';
    import FrequenciaService from '@/services/FrequenciaService';
    import AuthService from '@/services/AuthService';

    const alunos = AlunoService.listar();
    const totalAlunos = alunos.length;
    
    const aulas = AulaService.listar();
    const totalAulas = aulas.length;

    const disciplinas = FrequenciaService.totalDisciplinas();
    const frequenciaGeral = FrequenciaService.calcularFrequenciaDeTodos();

    const router = useRouter();

    const usuario = AuthService.usuarioLogado();

    function logout() {
        AuthService.logout();
        router.push('/');
    }
    function abrirAluno(id) {
        router.push(`/AlunoProfessor/${id}`);
    }
    function abrirDisciplina(indice) {
        router.push(`/DisciplinaProfessor/${indice}`);
    }
    const formatarNumero = (numero) => {
        if (Number.isInteger(numero)) {
            return numero.toString();
        }

        return numero.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };
</script>
<template>
    <h1>Sistema de Frequência</h1><button @click="logout()">Sair</button>
    <p>Olá, professor: {{ usuario.nome }}</p>
    <div class="container">
        <div><p>Alunos</p><p>{{ totalAlunos }}</p></div>
        <div><p>Aulas</p><p>{{ totalAulas }}</p></div>
        <div><p>Frequência</p><p>{{ formatarNumero(frequenciaGeral)}}%</p></div>
    </div>
    <p>Alunos:</p>
    <ul>
        <li v-for="aluno in alunos" :key="aluno.id" @click="abrirAluno(aluno.id)">
            {{ aluno.nome }} | Frequêncis: {{ formatarNumero(FrequenciaService.calcularFrequenciaGeral(aluno.id)) }}%
        </li>
    </ul>
    <p>Minhas Disciplinas:</p>
    <ul>
        <div>
            <li v-for="(disciplina, indice) in disciplinas" :key="disciplina" @click="abrirDisciplina(indice)">
                {{ disciplina }} <br>
                Aulas: {{ FrequenciaService.totalAulaPorDisciplina(disciplina) }}
            </li>
        </div>
    </ul>
    <button>+ Criar aula em nova Disciplina</button>
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