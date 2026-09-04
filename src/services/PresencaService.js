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
}