import { Empresa } from "src/app/login/models/empresa";

export interface Vaga {
  vagaId?: string;
  titulo: string;
  nivel?: string;
  escolaridade?: string;
  modelo?: string;
  dataAbertura?: Date;
  dataFechamento?: Date;
  requisitos?: string;
  tecnologias?: string;
  ativo?: boolean;
  area?: string;
  salario?: number;
  empresaId?: string;
  descricao?: string;
  Empresa?: Empresa;  
  
}


export interface VagaDTO {
  vagaId: string;
  titulo: string;
  nivel?: string;
  escolaridade?: string;
  modelo?: string;
  dataAbertura?: Date;
  dataFechamento?: Date;
  requisitos?: string[];
  descricao?: string;
  ativo: boolean;
  tecnologias?: string[];
  area?: string;
  empresaId: string;
  empresaNome?: string;
  endereco?: {
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    latitude?: number;
    longitude?: number;
  };
  distancia?: number;
  salario?: number;
  favoritado?: boolean;
}
export interface FiltroVagaDTO {
  candidatoId: string;               
  palavrasChave?: string;            // Palavras-chave da busca
  area?: string;                     // Área de atuação
  modelo?: string;                  // Modelo de trabalho
  experiencia?: string;              // Nível de experiência
  linguagens?: string[];             // Linguagens de programação selecionadas
  proximidade?: number;              // Raio em km
  page?: number;                     // Página atual
  take?: number;                     // Itens por página
}
export interface HistoricoCandidatura {
  historicoId: string;
  status: StatusVaga;
  dtCandidatura: string;
  dtAtualizacao: string;
  vaga: VagaHistorico;
}

export interface VagaHistorico {
  vagaId: string;
  titulo: string;
  nivel: string;
  modelo: string;
  area: string;
  salario: number;
  empresaId: string;
  descricao: string;
  tecnologias: string[];
  escolaridade: string;
  dataAbertura: string;
  dataFechamento: string;
  ativo: boolean;
}

export enum StatusVaga {
  CVRecebido = 0,
  CVRevisado = 1,
  CVPreSelecionado = 2,
  CVSelecionado = 3,
  CVNaoSelecionado = 4
}


export interface VagaDetalheDTO {
  vagaId: string;
  titulo: string;
  empresaNome: string;
  endereco: string;
  nivel: string;
  modelo: string;
  escolaridade: string;
  descricao: string;
  requisitos: string[]; // Alterado para array
  tecnologias: string[]; // Alterado para array
  area: string;
  salario: number;
  dataAbertura: Date;
  dataFechamento: Date;
}

export interface CurriculoDTO {
  curriculoId: string;
  experiencias: string; // Considere um array de objetos para experiencias mais detalhadas
  tecnologias: string; // Considere um array de strings
  competenciasTecnicas: string; // Considere um array de strings
  idiomas: string; // Considere um array de strings
  certificacoes: string; // Considere um array de strings
}

export interface CandidatoInfoDTO {
  nome: string;
  telefone: string;
  email: string;
  curriculo: CurriculoDTO | null;
}

export interface HistoricoCandidatoDTO {
  historicoId: string;
  status: number; // Enum no backend: 0 = CVRecebido, 1 = CVRevisado, etc.
  dtCandidatura: Date;
  dtAtualizacao: Date;
}

export interface CandidatoVagaDTO {
  candidatoId: string;
  candidato: CandidatoInfoDTO;
  historico: HistoricoCandidatoDTO;
}

export interface CandidatoStatusCount {
  total: number;
  emAnalise: number;
  revisado: number;
  entrevista: number;
  aprovados: number;
  rejeitados: number;
  // Adicione outros status conforme a necessidade
}
