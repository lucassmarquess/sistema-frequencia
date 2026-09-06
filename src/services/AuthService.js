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
        if (Array.isArray(usuario) && usuario.length === 0) {
            return null;
        }
        return usuario;
    }
    static estaAutenticado() {
        const usuario = AuthService.usuarioLogado();
        if (usuario !== null) {
            return true;
        }
        return false;
    }
    static tipoUsuario() {
        const autenticacao = AuthService.estaAutenticado();
        if (autenticacao === false) {
            return null;
        }
        const usuario = AuthService.usuarioLogado();
        const tipo = usuario.tipo;
        if (tipo === "professor") {
            return "professor";
        }
        return "aluno";
    }
}