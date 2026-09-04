/**
 * Responsável por realizar operações relacionadas a Aulas.
 */
import StorageService from "./StorageService";

export default class AulaService {
    static cadastrar(aula) {
        const dados = listar();
        dados.push(aula);
        StorageService.atualizar("aulas", dados);
    }
    static listar() {
        const aulas = StorageService.buscar("aulas");
        return aulas;
    }
}