/**
 * Responsável por realizar operações de armazenamento no LocalStorage.
 */
export default class StorageService {
    static salvar(chave, dados) {
        const texto = JSON.stringify(dados);
        localStorage.setItem(chave, texto);
    }
}