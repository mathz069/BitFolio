import { Candidato } from "src/app/models/candidato";

export class Empresa {
  empresaId?: string;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  descricao: string;
  logoUrl?: string;
  ativo: boolean;
  dtCadastro: Date;
  enderecoId?: string;
  endereco?: Endereco;
}

export class Endereco {
  enderecoId?: string;
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