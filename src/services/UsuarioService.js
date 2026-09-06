/**
 * Resposável por realizar operações relacionadas a Usuário
 */
import StorageService from "./StorageService";

export default class UsuarioService {
    static cadastrar(usuario) {
        const usuarios = StorageService.buscar("usuarios");
        usuarios.push(usuario);
        StorageService.atualizar("usuarios", usuarios);
    }
}