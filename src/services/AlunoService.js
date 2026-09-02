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
}