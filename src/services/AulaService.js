/**
 * Responsável por realizar operações relacionadas a Aulas.
 */
import StorageService from "./StorageService";
import PresencaService from "./PresencaService";

export default class AulaService {
    static cadastrar(aula) {
        const dados = AulaService.listar();
        dados.push(aula);
        StorageService.atualizar("aulas", dados);
    }
    static listar() {
        const aulas = StorageService.buscar("aulas");
        return aulas;
    }
    static buscarPorId(id) {
        const aulas = AulaService.listar();
        const elemento = aulas.find(aula => aula.id === id);
        return elemento;
    }
    static atualizar(id, aula) {
        const aulas = AulaService.listar();
        const indice  = aulas.findIndex(aula => aula.id === id);
        aulas[indice ] = aula;
        StorageService.atualizar("aulas", aulas);
    }
    static remover(id) {
        const aulas = AulaService.listar();
        const remocao = aulas.filter(aula => aula.id !== id);
        StorageService.atualizar("aulas", remocao);
    }
    static remover(id) {
        const aulas = AulaService.listar();
        const remocao = aulas.filter(aula => aula.id !== id);
        StorageService.atualizar("aulas", remocao);
        const presencas = PresencaService.listar();
        const remocaoPresencas = presencas.filter(
            presenca => presenca.aulaId !== id
        );
        StorageService.atualizar("presencas", remocaoPresencas);
    }
}