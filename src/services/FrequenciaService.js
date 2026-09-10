/**
 * Responsável por realizar operações relacionadas com Frequência.
 */
import AlunoService from "./AlunoService";
import AulaService from "./AulaService";
import PresencaService from "./PresencaService";

export default class FrequenciaService {
    static calcularFrequenciaGeral(alunoId) {
        const aulas = AulaService.listar();
        const presencas = PresencaService.listar();
        const totalAula = aulas.length;
        const presencasAluno = presencas.filter(presenca => presenca.alunoId === alunoId);
        const totalPresencas = presencasAluno.length;
        const total = totalPresencas / totalAula * 100;
        return total;
    }
    static calcularFrequenciaDisciplina(alunoId, disciplina) {
        const aulas = AulaService.listar();
        const materia = aulas.filter(aula => aula.disciplina === disciplina);
        const totalMateria = materia.length;
        const presencas = PresencaService.listar();
        const presencasAluno = presencas.filter(presenca =>
            presenca.alunoId === alunoId &&
            materia.some(aula => aula.id === presenca.aulaId)
        );
        const totalPresencas = presencasAluno.length;
        const total = totalPresencas / totalMateria * 100;
        return total;
    }
    static totalDisciplinas() {
        const aulas = AulaService.listar();
        const disciplinas = aulas.map(aula => aula.disciplina);
        const disciplina = new Set(disciplinas);
        return disciplina;
    }   
}