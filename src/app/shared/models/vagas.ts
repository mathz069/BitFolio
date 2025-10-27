export interface Vaga {
  vagaId?: string;
  titulo: string;
  nivel?: string;
  escolaridade?: string;
  modelo?: string;
  dataAbertura?: Date;
  empresaId?: string;
  descricao?: string;
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
