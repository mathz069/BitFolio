export class Funcionario {
  id: string;
  negocioId: string;
  nome: string;
  email: string;
  dtNascimento: string;
  salario: number;
  cargo: string;
  telefone: string;
  statusFunc: string;
  dtAdmissao: string;
  dtDemissao?: string | null;
  dtCriacao: string;
  dtAtualizacao: string;
  ativo: boolean;
}
