/**
 * Responsável por realizar operações relacionadas a Aulas.
 */
import StorageService from "./StorageService";

export default class AulaService {
    static cadastrar(aula) {
        const dados = StorageService.buscar("aulas");
        dados.push(aula);
        StorageService.atualizar("aulas", dados);
    }
}