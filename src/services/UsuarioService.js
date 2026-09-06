/**
 * Resposável por realizar operações relacionadas a Usuário
 */
import StorageService from "./StorageService";

export default class UsuarioService {
    static cadastrar(usuario) {
        const usuarios = UsuarioService.listar();
        usuarios.push(usuario);
        StorageService.atualizar("usuarios", usuarios);
    }
    static listar() {
        const usuarios = StorageService.buscar("usuarios");
        return usuarios;
    }
    static buscarPorId(id) {
        const usuarios = UsuarioService.listar();
        const elemento = usuarios.find(usuario => usuario.id === id);
        return elemento;
    }
}