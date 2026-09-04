/**
 * Responsável por realizar operações relacionadas a Alunos 
 */
import StorageService from "./StorageService";

export default class AlunoService {
    static cadastrar(aluno) {
        const dados = listar();
        dados.push(aluno);
        StorageService.atualizar("alunos", dados);
    }
    static listar() {
        return StorageService.buscar("alunos");
    }
    static buscarPorId(id) {
        const alunos = AlunoService.listar();
        const aluno = alunos.find(aluno => aluno.id === id);
        return aluno;
    }
    static atualizar(id, aluno) {
        const alunos = AlunoService.listar();
        const indice = alunos.findIndex(aluno => aluno.id === id);
        alunos[indice] = aluno;
        StorageService.atualizar("alunos", alunos);
    }
    static remover(id) {
        const alunos = AlunoService.listar();
        const remocao = alunos.filter(aluno => aluno.id !== id);
        StorageService.atualizar("alunos", remocao)
    }
}