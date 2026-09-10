<script setup>
import StorageService from "@/services/StorageService";
import Aluno from "../models/Aluno";
import Aula from "../models/Aula";
import Presenca from "../models/Presenca";

import AlunoService from "../services/AlunoService";
import AulaService from "../services/AulaService";
import PresencaService from "../services/PresencaService";
import FrequenciaService from "../services/FrequenciaService";

StorageService.remover("alunos");
StorageService.remover("aulas");
StorageService.remover("presencas");

// Alunos

AlunoService.cadastrar(
    new Aluno(1, "Lucas Marques", "lucas@email.com", "2026001")
);

AlunoService.cadastrar(
    new Aluno(2, "João Silva", "joao@email.com", "2026002")
);

AlunoService.cadastrar(
    new Aluno(3, "Maria Santos", "maria@email.com", "2026003")
);


// Aulas

AulaService.cadastrar(
    new Aula(1, "Banco de Dados", "2026-09-01", "08:00", "realizada", "token1")
);

AulaService.cadastrar(
    new Aula(2, "Banco de Dados", "2026-09-02", "08:00", "realizada", "token2")
);

AulaService.cadastrar(
    new Aula(3, "Banco de Dados", "2026-09-03", "08:00", "realizada", "token3")
);

AulaService.cadastrar(
    new Aula(4, "Banco de Dados", "2026-09-04", "08:00", "realizada", "token4")
);

AulaService.cadastrar(
    new Aula(5, "Programação", "2026-09-01", "10:00", "realizada", "token5")
);

AulaService.cadastrar(
    new Aula(6, "Programação", "2026-09-02", "10:00", "realizada", "token6")
);

AulaService.cadastrar(
    new Aula(7, "Programação", "2026-09-03", "10:00", "realizada", "token7")
);

AulaService.cadastrar(
    new Aula(8, "Programação", "2026-09-04", "10:00", "realizada", "token8")
);

AulaService.cadastrar(
    new Aula(9, "Engenharia de Software", "2026-09-01", "14:00", "realizada", "token9")
);

AulaService.cadastrar(
    new Aula(10, "Engenharia de Software", "2026-09-02", "14:00", "realizada", "token10")
);

AulaService.cadastrar(
    new Aula(11, "Engenharia de Software", "2026-09-03", "14:00", "realizada", "token11")
);

AulaService.cadastrar(
    new Aula(12, "Engenharia de Software", "2026-09-04", "14:00", "realizada", "token12")
);


// Presenças do Lucas

PresencaService.cadastrar(
    new Presenca(1, 1, 1, "2026-09-01T08:00")
);

PresencaService.cadastrar(
    new Presenca(2, 1, 2, "2026-09-02T08:00")
);

PresencaService.cadastrar(
    new Presenca(3, 1, 4, "2026-09-04T08:00")
);

PresencaService.cadastrar(
    new Presenca(4, 1, 5, "2026-09-01T10:00")
);

PresencaService.cadastrar(
    new Presenca(5, 1, 6, "2026-09-02T10:00")
);

PresencaService.cadastrar(
    new Presenca(6, 1, 7, "2026-09-03T10:00")
);

PresencaService.cadastrar(
    new Presenca(7, 1, 8, "2026-09-04T10:00")
);

PresencaService.cadastrar(
    new Presenca(8, 1, 9, "2026-09-01T14:00")
);

PresencaService.cadastrar(
    new Presenca(9, 1, 11, "2026-09-03T14:00")
);

console.log("Dados cadastrados com sucesso!");
console.log(FrequenciaService.calcularFrequenciaGeral(1));
console.log(
    "Banco de Dados:",
    FrequenciaService.calcularFrequenciaDisciplina(1, "Banco de Dados")
);
console.log(
    "Programação:",
    FrequenciaService.calcularFrequenciaDisciplina(1, "Programação")
);
console.log(
    "Engenharia de Software:",
    FrequenciaService.calcularFrequenciaDisciplina(1, "Engenharia de Software")
);
console.log(FrequenciaService.totalDisciplinas());
</script>

<template>
    <h1>Dados de teste cadastrados!</h1>
</template>