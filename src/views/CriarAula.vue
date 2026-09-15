<script setup>
    import Aula from '@/models/Aula';
    import AulaService from '@/services/AulaService';   
    import FrequenciaService from '@/services/FrequenciaService';
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const disciplina = ref("");
    const materia = ref("");
    const disciplinas = FrequenciaService.totalDisciplinas();

    const totalDeAulas = AulaService.listar();

    let novoId;
    let novoToken;

    if (totalDeAulas.length === 0) {
        novoId = 1;
        novoToken = "token1";
    } else {
        const ultimaAula = totalDeAulas.at(-1);
        novoId = ultimaAula.id + 1;
        const numero = Number(ultimaAula.token.replace("token", ""));
        novoToken = "token" + (numero + 1);
    }

    const data = new Date().toISOString().split('T')[0];
    const horario = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
    

    function Criar() {
        let disciplinaEscolhida;
        if (disciplina.value === "nova") {
            disciplinaEscolhida = materia.value
        }
        else {
            disciplinaEscolhida = disciplina.value;
        }
        AulaService.cadastrar(
            new Aula(novoId, disciplinaEscolhida, data, horario, "aberta", novoToken)
        );
        router.push(`/PresencasProfessor/${novoId}`);
    }
    function voltar() {
        router.push("/DashBoardProfessor");
    }
</script>
<template>
    <h1>Nova Aula</h1>
    <form>
        <label for="disciplina">Disciplina:</label>

        <select id="disciplina" v-model="disciplina">
            <option
                v-for="disciplina in disciplinas" :key="disciplina":value="disciplina">
                {{ disciplina }}
            </option>
            <option value="nova">+ Nova disciplina</option>
        </select><br>
        <div v-if="disciplina === 'nova'">
            <input type="text" placeholder="Nova Disciplina" v-model="materia">
        </div>
        <p>Data: {{ data }}</p>
        <p>Horário: {{ horario }}</p>
        <button @click="Criar()">Criar</button>
    </form>
    <button @click="voltar()">Voltar</button>
</template>