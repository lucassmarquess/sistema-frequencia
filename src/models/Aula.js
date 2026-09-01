/**
 * Representa uma aula cadastrada no sistema
 */
export default class Aula {
    constructor(id, disciplina, data, horario, status, token) {
        this.id = id;
        this.disciplina = disciplina;
        this.data = data;
        this.horario = horario;
        this.status = status;
        this.token = token;
    }
}