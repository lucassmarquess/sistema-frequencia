/**
 * Responsável por realizar operações de armazenamento no LocalStorage.
 */
export default class StorageService {
    static salvar(chave, dados) {
        const texto = JSON.stringify(dados);
        localStorage.setItem(chave, texto);
    }
    static buscar(chave) {
        const dadosJson  = localStorage.getItem(chave);
        if (dadosJson === null){
            return [];
        }
        const dados  = JSON.parse(dadosJson );
        return dados ;
    }
    static remover(chave) {
        localStorage.removeItem(chave);
    }
    static atualizar(chave, dados) {
        StorageService.salvar(chave, dados);
    }
}