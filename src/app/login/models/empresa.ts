import { Candidato } from "src/app/models/candidato";

export class Empresa {
  empresaId?: number;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  descricao: string;
  logoUrl?: string;
  ativo: boolean;
  dtCadastro: Date;
  enderecoId?: number;
  endereco?: Endereco;
}

export class Endereco {
  enderecoId?: number;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  candidato?: Candidato;
  empresa?: Empresa;
}