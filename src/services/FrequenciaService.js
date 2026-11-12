
/**
 * Responsável por realizar operações relacionadas com Frequência.
 */
import AlunoService from "./AlunoService";
import AulaService from "./AulaService";
import PresencaService from "./PresencaService";

export default class FrequenciaService {

    static calcularFrequenciaGeral(alunoId) {
        const aluno = AlunoService.buscarPorId(alunoId);

        if (aluno === undefined) {
            return null;
        }

        const aulas = AulaService.listar();
        const presencas = PresencaService.listar();

        if (aulas.length === 0) {
            return null;
        }

        const totalPresencas = presencas.filter(
            presenca =>
                presenca.alunoId === alunoId &&
                presenca.status === "presente" &&
                aulas.some(aula => aula.id === presenca.aulaId)
        ).length;

        return (totalPresencas / aulas.length) * 100;
    }

    static calcularAusenciasJustificadas(alunoId) {
        const aluno = AlunoService.buscarPorId(alunoId);

        if (aluno === undefined) {
            return null;
        }

        const aulas = AulaService.listar();
        const presencas = PresencaService.listar();

        if (aulas.length === 0) {
            return null;
        }

        const presencasAluno = presencas.filter(
            presenca =>
                presenca.alunoId === alunoId &&
                aulas.some(aula => aula.id === presenca.aulaId)
        );

        const totalPresencas = presencasAluno.filter(
            presenca => presenca.status === "presente"
        ).length;

        const totalJustificadas = presencasAluno.filter(
            presenca => presenca.status === "justificada"
        ).length;

        const totalAusencias = aulas.length - totalPresencas;

        if (totalAusencias === 0) {
            return null;
        }

        return (totalJustificadas / totalAusencias) * 100;
    }

    static calcularFrequenciaDisciplina(alunoId, disciplina) {
        const aluno = AlunoService.buscarPorId(alunoId);

        if (aluno === undefined) {
            return null;
        }

        const aulas = AulaService.listar();

        const aulasDisciplina = aulas.filter(
            aula => aula.disciplina === disciplina
        );

        if (aulasDisciplina.length === 0) {
            return null;
        }

        const presencas = PresencaService.listar();

        const totalPresencas = presencas.filter(
            presenca =>
                presenca.alunoId === alunoId &&
                presenca.status === "presente" &&
                aulasDisciplina.some(aula => aula.id === presenca.aulaId)
        ).length;

        return (totalPresencas / aulasDisciplina.length) * 100;
    }


static calcularFrequenciaDeTodos() {
    const alunos = AlunoService.listarAtivos();
    const aulas = AulaService.listar();
    const presencas = PresencaService.listar();

    const totalPossibilidades = alunos.length * aulas.length;

    if (totalPossibilidades === 0) {
        return null;
    }

    const totalPresencas = presencas.filter(
        presenca =>
            presenca.status === "presente" &&
            alunos.some(aluno => aluno.id === presenca.alunoId) &&
            aulas.some(aula => aula.id === presenca.aulaId)
    ).length;

    return (totalPresencas / totalPossibilidades) * 100;
}


    static totalDisciplinas() {
        const aulas = AulaService.listar();
        const disciplinas = aulas.map(aula => aula.disciplina);

        return new Set(disciplinas);
    }

    static totalAulaPorDisciplina(disciplina) {
        const aulas = AulaService.listar();

        const disciplinas = aulas.filter(
            aula => aula.disciplina === disciplina
        );

        return disciplinas.length;
    }

    static aulasDeDisciplina(disciplina) {
        const aulas = AulaService.listar();

        const disciplinas = aulas.filter(
            aula => aula.disciplina === disciplina
        );

        return disciplinas;
    }
}
