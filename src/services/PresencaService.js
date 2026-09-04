/**
 * Responsável por realizar operações relacionadas a Presença.
 */
import StorageService from "./StorageService";

export default class PresencaService {
    static cadastrar(presenca) {
        const presencas = StorageService.buscar("presencas");
        presencas.push(presenca);
        StorageService.atualizar("presencas", presencas);
    }
}