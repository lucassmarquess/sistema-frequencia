
/**
 * Responsável por gerar e validar QR Codes temporários.
 */
import StorageService from "./StorageService";
import AulaService from "./AulaService";

export default class QrCodeService {

    // Gera um QR Code com validade de cinco minutos.
    static gerar(aulaId) {
        const aula = AulaService.buscarPorId(aulaId);

        if (aula === undefined) {
            return {
                sucesso: false,
                mensagem: "Aula não encontrada."
            };
        }

        if (aula.status !== "aberta") {
            return {
                sucesso: false,
                mensagem: "Não é possível gerar QR Code para uma aula encerrada."
            };
        }

        const agora = Date.now();
        const codigos = StorageService.buscar("qrCodes");

        // Mantém os códigos ativos de outras aulas.
        const codigosAtivos = codigos.filter(
            codigo =>
                codigo.aulaId !== aulaId &&
                codigo.ativo === true &&
                codigo.expiraEm > agora
        );

        const novoCodigo = {
            token: crypto.randomUUID(),
            aulaId: aulaId,
            expiraEm: agora + (5 * 60 * 1000),
            ativo: true
        };

        codigosAtivos.push(novoCodigo);

        StorageService.atualizar("qrCodes", codigosAtivos);

        return {
            sucesso: true,
            codigo: novoCodigo
        };
    }

    // Verifica se o token existe e continua válido.
    static validar(token) {
        const codigos = StorageService.buscar("qrCodes");

        const codigo = codigos.find(
            elemento => elemento.token === token
        );

        if (codigo === undefined) {
            return {
                valido: false,
                mensagem: "QR Code inválido ou inexistente."
            };
        }

        if (codigo.ativo !== true) {
            return {
                valido: false,
                mensagem: "Este QR Code foi desativado."
            };
        }

        if (Date.now() >= codigo.expiraEm) {
            QrCodeService.invalidar(token);

            return {
                valido: false,
                mensagem: "Este QR Code expirou."
            };
        }

        const aula = AulaService.buscarPorId(codigo.aulaId);

        if (aula === undefined) {
            QrCodeService.invalidar(token);

            return {
                valido: false,
                mensagem: "A aula não foi encontrada."
            };
        }

        if (aula.status !== "aberta") {
            QrCodeService.invalidar(token);

            return {
                valido: false,
                mensagem: "Esta aula já foi encerrada."
            };
        }

        return {
            valido: true,
            codigo: codigo,
            aula: aula
        };
    }

    // Desativa um código específico.
    static invalidar(token) {
        const codigos = StorageService.buscar("qrCodes");

        const indice = codigos.findIndex(
            codigo => codigo.token === token
        );

        if (indice === -1) {
            return false;
        }

        codigos[indice].ativo = false;

        StorageService.atualizar("qrCodes", codigos);

        return true;
    }

    // Desativa todos os códigos de uma aula.
    static invalidarPorAula(aulaId) {
        const codigos = StorageService.buscar("qrCodes");

        const atualizados = codigos.map(codigo => {
            if (codigo.aulaId === aulaId) {
                return {
                    ...codigo,
                    ativo: false
                };
            }

            return codigo;
        });

        StorageService.atualizar("qrCodes", atualizados);
    }
}
