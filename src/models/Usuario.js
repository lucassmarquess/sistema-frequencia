/**
 * Representa um usuário cadastrado no sistema
 */
export default class Usuario {
    constructor(id, nome, email, tipo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.tipo = tipo;
    }
}