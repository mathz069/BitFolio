export class Empresa {
  id?: number;
  nome: string;
  cnpj: string;
  email: string;
  descricao: string;
  logoUrl?: string;
  ativo: boolean;
  dtAprovacao?: Date;
  dtCadastro: Date;
  enderecoId?: number;
  endereco?: Endereco;
}

export class Endereco {
  id?: number;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  dtCriacao?: Date;
  dtAtualizacao?: Date;
}