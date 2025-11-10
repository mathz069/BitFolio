export class Curriculo {
  curriculoId?: string;
  experiencias?: string | null;
  tecnologias: string | null = null;
  competenciasTecnicas: string | null = null;
  idiomas: string | null = null;
  certificacoes?: string | null;
}

export interface FuncionarioDTO {
  recrutadorId: string;
  nome: string;
  telefone?: string;
  email: string;
  ativo: boolean;
  empresaId?: string;
  ultimoAcesso?: Date;
}