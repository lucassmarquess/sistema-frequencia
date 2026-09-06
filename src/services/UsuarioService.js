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
    static atualizar(id, usuario) {
        const usuarios = UsuarioService.listar();
        const indice = usuarios.findIndex(usuario => usuario.id === id);
        if (indice === -1) {
            return "Usuário não existe";
        }
        usuarios[indice] = usuario;
        StorageService.atualizar("usuarios", usuarios);
        return "Usuário atualizado com sucesso";
    }
    static remover(id) {
        const usuarios = UsuarioService.listar();
        const indice = usuarios.findIndex(usuario => usuario.id === id);
        if (indice === -1) {
            return "Usuário não existe";
        }
        const remocao = usuarios.filter(usuario => usuario.id !== id);
        StorageService.atualizar("usuarios", remocao);
        return "Remoção realizada com sucesso";
    }
}