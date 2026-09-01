/**
 * Representa um aluno cadastrado no sistema.
 */
export default class Aluno {
    constructor(id, nome, email, matricula) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.matricula = matricula;
    }
}