
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
        const aula = AulaService.buscarPorId(aulaId);

        if (aula === undefined) {
            return "Aula não existe";
        }

        // Depois do encerramento, somente justificativas são permitidas.
        if (
            aula.status !== "aberta" &&
            presenca.status !== "justificada"
        ) {
            return "Aula encerrada: somente justificativas são permitidas";
        }

        if (
            presenca.status !== "presente" &&
            presenca.status !== "justificada"
        ) {
            return "Status de presença inválido";
        }

        const verificar = PresencaService.verificarExistencia(
            alunoId,
            aulaId
        );

        if (verificar === true) {
            return "Presença duplicada";
        }

        const presencas = PresencaService.listar();

        presencas.push(presenca);

        StorageService.atualizar("presencas", presencas);

        return "Cadastro realizado";
    }

    static listar() {
        return StorageService.buscar("presencas");
    }

    static buscarPorId(id) {
        const presencas = PresencaService.listar();

        return presencas.find(
            presenca => presenca.id === id
        );
    }

    static atualizar(id, presenca) {
        const alunoId = presenca.alunoId;

        if (AlunoService.buscarPorId(alunoId) === undefined) {
            return "Aluno não existe";
        }

        const aulaId = presenca.aulaId;
        const aula = AulaService.buscarPorId(aulaId);

        if (aula === undefined) {
            return "Aula não existe";
        }

        if (
            aula.status !== "aberta" &&
            presenca.status !== "justificada"
        ) {
            return "Aula encerrada: somente justificativas são permitidas";
        }

        if (
            presenca.status !== "presente" &&
            presenca.status !== "justificada"
        ) {
            return "Status de presença inválido";
        }

        const presencas = PresencaService.listar();

        const indice = presencas.findIndex(
            elemento => elemento.id === id
        );

        if (indice === -1) {
            return "Presença inexistente";
        }

        const verificacao = PresencaService.verificarExistencia(
            alunoId,
            aulaId,
            id
        );

        if (verificacao === true) {
            return "Presença não pode ser duplicada";
        }

        presencas[indice] = presenca;

        StorageService.atualizar("presencas", presencas);

        return "Atualizado com sucesso";
    }

    static remover(id) {
        const presencas = PresencaService.listar();

        const indice = presencas.findIndex(
            presenca => presenca.id === id
        );

        if (indice === -1) {
            return "Presença inexistente";
        }

        const remocao = presencas.filter(
            presenca => presenca.id !== id
        );

        StorageService.atualizar("presencas", remocao);

        return "Remoção realizada com sucesso";
    }

    static verificarExistencia(alunoId, aulaId, id = null) {
        const presencas = PresencaService.listar();

        return presencas.some(
            presenca =>
                presenca.alunoId === alunoId &&
                presenca.aulaId === aulaId &&
                presenca.id !== id
        );
    }

    static buscarPorAlunoEAula(alunoId, aulaId) {
        const presencas = PresencaService.listar();

        return presencas.find(
            presenca =>
                presenca.alunoId === alunoId &&
                presenca.aulaId === aulaId
        );
    }
}
