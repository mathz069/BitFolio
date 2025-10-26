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
}
export interface FiltroVagaDTO {
  candidatoId: string;               // Id do usuário logado
  palavrasChave?: string;            // Palavras-chave da busca
  area?: string;                     // Área de atuação
  experiencia?: string;              // Nível de experiência
  linguagens?: string[];             // Linguagens de programação selecionadas
  proximidade?: number;              // Raio em km
  page?: number;                     // Página atual
  take?: number;                     // Itens por página
}
