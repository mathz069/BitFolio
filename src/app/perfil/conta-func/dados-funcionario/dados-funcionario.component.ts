import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';
import { CandidatoService } from 'src/app/shared/services/candidato.service';
import { FuncionarioService } from 'src/app/shared/services/funcionario.service';

@Component({
  selector: 'app-dados-funcionario',
  templateUrl: './dados-funcionario.component.html',
  styleUrl: './dados-funcionario.component.css'
})
export class DadosFuncionarioComponent {

  form: FormGroup;
  editando = false;
  funcionarioId: string;

  constructor(
    private fb: FormBuilder,
    private funcionarioService: FuncionarioService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      dataNascimento: ['', [Validators.required, this.verificarMaiorDeIdade]]
    });

    this.toggleFormState();

    const id = this.authService.obterUsuarioId();
    if (id) {
      this.funcionarioId = id;
      this.carregarFuncionario();
    } else {
      console.error('ID do candidato não encontrado no token.');
    }
  }

  /** Carrega dados do candidato logado */
  carregarFuncionario(): void {
    this.funcionarioService.getFuncionarioById(this.funcionarioId).subscribe({
      next: (funcionario) => {
        this.form.patchValue({
          nome: funcionario.nome,
          email: funcionario.email,
          telefone: funcionario.telefone,
        });
      },
      error: (err) => console.error('Erro ao buscar candidato:', err)
    });
  }

  /** Alterna entre modo de edição e leitura */
  toggleEdicao(): void {
    this.editando = !this.editando;
    this.toggleFormState();
  }

  /** Ativa/desativa o form conforme modo */
  private toggleFormState(): void {
    if (this.editando) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  /** Validação para garantir idade >= 18 */
  private verificarMaiorDeIdade(data: string): boolean {
  if (!data) return false;
  const hoje = new Date();
  const nascimento = new Date(data);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade >= 18;
}

  /** Atualiza os dados do candidato */
  atualizarDados(): void {
  if (this.form.invalid) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }


  const funcionarioAtualizado = {
    id: this.funcionarioId,
    ...this.form.value
  };

  this.funcionarioService.updateFuncionario(funcionarioAtualizado).subscribe({
    next: () => {
      alert('Dados atualizados com sucesso!');
      this.editando = false;
      this.toggleFormState();
    },
    error: (err) => {
      console.error('Erro ao atualizar dados:', err);
      alert('Erro ao atualizar dados.');
    }
  });
}


  /** Deleta o candidato logado */
  deletarCandidato(): void {
    if (confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
      this.funcionarioService.deleteFuncionario(this.funcionarioId).subscribe({
        next: () => {
          alert('Conta deletada com sucesso.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erro ao deletar conta:', err);
          alert('Erro ao deletar a conta.');
        }
      });
    }
  }
}