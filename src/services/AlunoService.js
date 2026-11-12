
/**
 * Responsável por realizar operações relacionadas a Alunos.
 */
import StorageService from "./StorageService";

export default class AlunoService {

    static cadastrar(aluno) {
        const dados = AlunoService.listar();

        dados.push(aluno);

        StorageService.atualizar("alunos", dados);
    }

    static listar() {
        return StorageService.buscar("alunos");
    }

    static listarAtivos() {
        const alunos = AlunoService.listar();

        return alunos.filter(aluno => aluno.ativo !== false);
    }

    static buscarPorId(id) {
        const alunos = AlunoService.listar();

        return alunos.find(aluno => aluno.id === id);
    }

    static atualizar(id, aluno) {
        const alunos = AlunoService.listar();

        const indice = alunos.findIndex(
            elemento => elemento.id === id
        );

        if (indice === -1) {
            return "Aluno não existe";
        }

        alunos[indice] = aluno;

        StorageService.atualizar("alunos", alunos);

        return "Aluno atualizado com sucesso";
    }

    static alterarStatus(id, ativo) {
        const aluno = AlunoService.buscarPorId(id);

        if (aluno === undefined) {
            return "Aluno não existe";
        }

        aluno.ativo = ativo;

        return AlunoService.atualizar(id, aluno);
    }

    static remover(id) {
        const alunos = AlunoService.listar();

        const remocao = alunos.filter(
            aluno => aluno.id !== id
        );

        StorageService.atualizar("alunos", remocao);
    }
}
