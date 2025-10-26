export class RegisterCandidato {
  nome: string;
  email: string;
  senha: string;
  dataNascimento: string; 
  telefone: string;
}
export class RegisterFuncionario {
  nome: string;
  email: string;
  senha: string;
  dataNascimento: string;
  telefone: string;
  empresaId: string;
}

export class RegisterAdministrador {
  nome: string;
  email: string;
  senha: string;
  dataNascimento: string;
  telefone: string;
}

export class LoginDto {
  email: string;
  senha: string;
  tipo: 'candidato' | 'funcionario' | 'administrador';
}

export interface TokenTemporario {
  email: string;
  codigo: string;
}