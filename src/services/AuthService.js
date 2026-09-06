/**
 * Responsável por realizar operações relacionadas a autenticação.
 */
import StorageService from "./StorageService";
import UsuarioService from "./UsuarioService";

export default class AuthService{
    static login(email) {
        const usuarios = UsuarioService.listar();
        const autenticacao = usuarios.find(usuario => usuario.email === email);
        if (autenticacao === undefined) {
            return "Usuário não identificado";
        } 
        StorageService.atualizar("usuarioLogado", autenticacao);
        return "Login realizado com sucesso";
    }
    static logout() {
        StorageService.remover("usuarioLogado");
        return "Logout realizado com sucesso";
    }
    static usuarioLogado() {
        const usuario = StorageService.buscar("usuarioLogado");
        return usuario;
    }
}