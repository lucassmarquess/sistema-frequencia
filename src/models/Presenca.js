/**
 * Representa uma presença cadastrada no sistema.
 */
export default class Presenca {
    constructor(id, alunoId, aulaId, dataHora, status) {
        this.id = id;
        this.alunoId = alunoId;
        this.aulaId = aulaId;
        this.dataHora = dataHora;
        this.status = status;
    }
}