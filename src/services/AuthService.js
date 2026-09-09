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
            return false;
        } 
        StorageService.atualizar("usuarioLogado", autenticacao);
        return true;
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
    static ehProfessor() {
        const autenticacao = AuthService.estaAutenticado();
        if (autenticacao === false) {
            return false;
        }
        const tipo = AuthService.tipoUsuario();
        if (tipo === "aluno") {
            return false;
        } 
        return true;
    }
}