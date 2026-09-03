/**
 * Responsável por realizar operações relacionadas a Alunos 
 */
import StorageService from "./StorageService";

export default class AlunoService {
    static cadastrar(aluno) {
        const dados = StorageService.buscar("alunos");
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
}