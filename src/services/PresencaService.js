/**
 * Responsável por realizar operações relacionadas a Presença.
 */
import StorageService from "./StorageService";
import AlunoService from "./AlunoService";
import AulaService from "./AulaService";

export default class PresencaService {
    static cadastrar(presenca) {
        const alunoId = presenca.alunoId;
        if (AlunoService.buscarPorId(alunoId) === undefined) {
            return "Aluno não existe";
        }
        const aulaId = presenca.aulaId;
        if (AulaService.buscarPorId(aulaId) === undefined) {
            return "Aula não existe";
        }
        const verificar = PresencaService.verificarExistencia(alunoId, aulaId);
        if (verificar === true ) {
            return "Presença duplicada";
        }
        const presencas = PresencaService.listar();
        presencas.push(presenca);
        StorageService.atualizar("presencas", presencas);
        return "Cadastro realizado";
    }
    static listar() {
        const presencas = StorageService.buscar("presencas");
        return presencas;
    }
    static buscarPorId(id) {
        const presencas = PresencaService.listar();
        const elemento = presencas.find(presenca => presenca.id === id);
        return elemento;
    }
    static atualizar(id, presenca) {
        const alunoId = presenca.alunoId;
        if (AlunoService.buscarPorId(alunoId) === undefined) {
            return "Aluno não existe";
        }
        const aulaId = presenca.aulaId;
        if (AulaService.buscarPorId(aulaId) === undefined) {
            return "Aula não existe";
        }
        const verificacao = PresencaService.verificarExistencia(alunoId, aulaId, id);
        if (verificacao === true) {
            return "Presença não pode ser duplicada";
        }
        const presencas = PresencaService.listar();
        const indice = presencas.findIndex(presenca => presenca.id === id);
        if (indice === -1) {
            return "Presença inexistente";
        }
        presencas[indice] = presenca;
        StorageService.atualizar("presencas", presencas);
        return "Atualizado com socesso";
    }
    static remover(id) {
        const presencas = PresencaService.listar();
        const verificacao = presencas.findIndex(presenca => presenca.id === id);
        if (verificacao === -1) {
            return "Presença inexistente";
        }
        const remocao = presencas.filter(presenca => presenca.id !== id);
        StorageService.atualizar("presencas", remocao);
        return "Remoção realizada com sucesso";
    }
    static verificarExistencia(alunoId, aulaId, id = null) {
        const presencas = PresencaService.listar();
        return presencas.some(presenca => 
            presenca.alunoId === alunoId &&
            presenca.aulaId === aulaId &&
            presenca.id !== id
        );
    }
}