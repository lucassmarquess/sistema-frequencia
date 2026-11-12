
/**
 * Responsável por realizar operações relacionadas a Usuário.
 */
import StorageService from "./StorageService";

export default class UsuarioService {

    static cadastrar(usuario) {
        const usuarios = UsuarioService.listar();

        const email = usuario.email.trim().toLowerCase();

        const duplicidade = usuarios.some(
            elemento => elemento.email.trim().toLowerCase() === email
        );

        if (duplicidade) {
            return "E-mail já cadastrado";
        }

        usuarios.push(usuario);

        StorageService.atualizar("usuarios", usuarios);

        return "Usuário cadastrado com sucesso";
    }

    static listar() {
        return StorageService.buscar("usuarios");
    }

    static buscarPorId(id) {
        const usuarios = UsuarioService.listar();

        return usuarios.find(usuario => usuario.id === id);
    }

    static buscarPorEmail(email, id = null) {
        const usuarios = UsuarioService.listar();

        const emailNormalizado = email.trim().toLowerCase();

        return usuarios.find(
            usuario =>
                usuario.email.trim().toLowerCase() === emailNormalizado &&
                usuario.id !== id
        );
    }

    static atualizar(id, usuario) {
        const usuarios = UsuarioService.listar();

        const indice = usuarios.findIndex(
            elemento => elemento.id === id
        );

        if (indice === -1) {
            return "Usuário não existe";
        }

        const duplicidade = UsuarioService.buscarPorEmail(
            usuario.email,
            id
        );

        if (duplicidade !== undefined) {
            return "E-mail já cadastrado";
        }

        usuario.id = id;

        usuarios[indice] = usuario;

        StorageService.atualizar("usuarios", usuarios);

        return "Usuário atualizado com sucesso";
    }

    static remover(id) {
        const usuarios = UsuarioService.listar();

        const indice = usuarios.findIndex(
            usuario => usuario.id === id
        );

        if (indice === -1) {
            return "Usuário não existe";
        }

        const remocao = usuarios.filter(
            usuario => usuario.id !== id
        );

        StorageService.atualizar("usuarios", remocao);

        return "Remoção realizada com sucesso";
    }

    static buscaPorTipo(tipo) {
        const usuarios = UsuarioService.listar();

        return usuarios.filter(
            usuario => usuario.tipo === tipo
        );
    }
}
