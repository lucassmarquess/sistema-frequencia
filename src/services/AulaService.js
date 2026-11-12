
/**
 * Responsável por realizar operações relacionadas a Aulas.
 */
import StorageService from "./StorageService";

export default class AulaService {

    static cadastrar(aula) {
        const aulas = AulaService.listar();

        const existente = aulas.some(
            elemento => elemento.id === aula.id
        );

        if (existente) {
            return "Já existe uma aula com esse ID";
        }

        aulas.push(aula);
        StorageService.atualizar("aulas", aulas);

        return "Aula cadastrada com sucesso";
    }

    static listar() {
        return StorageService.buscar("aulas");
    }

    static buscarPorId(id) {
        const aulas = AulaService.listar();

        return aulas.find(
            aula => aula.id === id
        );
    }

    static atualizar(id, aula) {
        const aulas = AulaService.listar();

        const indice = aulas.findIndex(
            elemento => elemento.id === id
        );

        if (indice === -1) {
            return "Aula inexistente";
        }

        // Preserva o ID original da aula.
        aulas[indice] = {
            ...aula,
            id: id
        };

        StorageService.atualizar("aulas", aulas);

        return "Aula atualizada com sucesso";
    }

    static remover(id) {
        const aulas = AulaService.listar();

        const indice = aulas.findIndex(
            aula => aula.id === id
        );

        if (indice === -1) {
            return "Aula inexistente";
        }

        const remocao = aulas.filter(
            aula => aula.id !== id
        );

        StorageService.atualizar("aulas", remocao);

        // Remove também as presenças relacionadas à aula.
        const presencas = StorageService.buscar("presencas");

        const remocaoPresencas = presencas.filter(
            presenca => presenca.aulaId !== id
        );

        StorageService.atualizar("presencas", remocaoPresencas);

        return "Aula removida com sucesso";
    }
}
