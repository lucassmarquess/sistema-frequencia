<script setup>
    import { useRoute } from 'vue-router';
    import { useRouter } from 'vue-router';
    import AulaService from '@/services/AulaService';
    import AlunoService from '@/services/AlunoService';
    import PresencaService from '@/services/PresencaService';
    import Presenca from '@/models/Presenca';
    import FrequenciaService from '@/services/FrequenciaService';

    const route = useRoute();
    const aulaId = Number(route.params.id);
    const aula = AulaService.buscarPorId(aulaId);

    const alunos = AlunoService.listar();

    const agora = new Date();
    const dataHora = agora.toISOString().slice(0, 16);

    const totalPresencas = PresencaService.listar();
    let novoId;
    if (totalPresencas.length === 0) {
        novoId = 1;
    } else {
        const ultimaPresenca = totalPresencas.at(-1);
        novoId = ultimaPresenca.id + 1;
    }

    const router = useRouter();
    const disciplinas = FrequenciaService.totalDisciplinas();
    const indice = [...disciplinas].findIndex(disciplina => disciplina === aula.disciplina);

    function possuiPresenca(alunoId) {
        return PresencaService.verificarExistencia(alunoId, aulaId);
    }
    function encerrarAula() {
        const aulaAtual = AulaService.buscarPorId(aulaId);
        aulaAtual.status = "realizada";
        AulaService.atualizar(aulaId, aulaAtual);
    }
    function marcarPresenca(id) {
        PresencaService.cadastrar(
            new Presenca(novoId, id, aulaId, dataHora, "presente")
        )
    }
    function justificarFalta(id) {
        PresencaService.cadastrar(
            new Presenca(novoId, id, aulaId, dataHora, "justificada")
        )
    }
    function buscarPresenca(alunoId) {
        return PresencaService.buscarPorAlunoEAula(alunoId, aulaId);
    }
    function voltar() {
        router.push(`/DisciplinaProfessor/${indice}`);
    }
    function excluir() {
        AulaService.remover(aulaId);
        if (AulaService.listar().length === 0) {
            router.push("/DashBoardProfessor");
        }
        else {
            return voltar();
        }
    }
</script>
<template>
    <h1>{{ aula.disciplina }}</h1>
    <p>{{ aula.data }}   *   {{ aula.horario }}</p>
    <p>Status: {{ aula.status }}</p>

    <p>Alunos:</p>
    <ul>
        <li v-for="aluno in alunos" :key="aluno.id">
            {{ aluno.nome }}<br>
            {{ aluno.matricula }}<br>
            <div v-if="possuiPresenca(aluno.id)">
                {{ buscarPresenca(aluno.id).status }}
            </div>
            <div v-else-if="aula.status === 'realizada'">
                <button @click="justificarFalta(aluno.id)">Justificar Falta</button>
            </div>
            <div v-else>
                <button @click="marcarPresenca(aluno.id)">Marcar Presença</button>
                <button @click="justificarFalta(aluno.id)">Justificar Falta</button>
            </div>
        </li>
    </ul>

    <button>Abrir QR Code</button><br>
    <div v-if="aula.status === 'aberta'">
        <button @click="encerrarAula()">Encerrar Aula</button><br>
    </div>
    <button @click="excluir()">Excluir Aula</button><br>
    <button @click="voltar()">Voltar</button>
</template>