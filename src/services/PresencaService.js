/**
 * Responsável por realizar operações relacionadas a Presença.
 */
import StorageService from "./StorageService";

export default class PresencaService {
    static cadastrar(presenca) {
        const presencas = PresencaService.listar();
        presencas.push(presenca);
        StorageService.atualizar("presencas", presencas);
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
        const presencas = PresencaService.listar();
        const indice = presencas.findIndex(presenca => presenca.id === id);
        presencas[indice] = presenca;
        StorageService.atualizar("presencas", presencas);
    }
    static remover(id) {
        const presencas = PresencaService.listar();
        const remocao = presencas.filter(presenca => presenca.id !== id);
        StorageService.atualizar("presencas", remocao);
    }
    static verificarExistencia(alunoId, aulaId) {
        const presencas = PresencaService.listar();
        return presencas.some(presenca => 
            presenca.alunoId === alunoId &&
            presenca.aulaId === aulaId
        );
    }
}