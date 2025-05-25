export class RegisterCandidato {
  nome: string;
  email: string;
  senha: string;
  dataNascimento: string; 
  telefone: string;
  curriculoPdf: File;
}
export class RegisterFuncionario {
  nome: string;
  email: string;
  senha: string;
  dataNascimento: string;
  telefone: string;
  cargo: string;
  dtAdmissao: Date;
  negocioId: string;
}

export class RegisterAdministrador {
  nome: string;
  email: string;
  senha: string;
  dataNascimento: string;
  telefone: string;
  cargo: string;
  dtAdmissao: Date;
  negocioId: string;
}
export class LoginDto {
  email: string;
  senha: string;
  tipo: 'candidato' | 'funcionario' | 'administrador';
}
