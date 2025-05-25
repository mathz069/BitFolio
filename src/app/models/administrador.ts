export class Administrador {
  id: number;
  negocioId: number;
  nome: string;
  email: string;
  salario: number;
  telefone: string;
  dtNascimento: string;
  cargo: string;
  aprovado: boolean;
  dtAprovacao?: string | null;
  dtCadastro: string;
}
