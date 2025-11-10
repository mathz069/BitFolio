import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';
import { CandidatoService } from 'src/app/shared/services/candidato.service';

@Component({
  selector: 'app-meus-dados',
  templateUrl: './meus-dados.component.html',
  styleUrl: './meus-dados.component.css'
})
export class DadosComponent implements OnInit {

  form: FormGroup;
  editando = false;
  candidatoId: string;

  constructor(
    private fb: FormBuilder,
    private candidatoService: CandidatoService,
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
      this.candidatoId = id;
      this.carregarCandidato();
    } else {
      console.error('ID do candidato não encontrado no token.');
    }
  }

  /** Carrega dados do candidato logado */
  carregarCandidato(): void {
    this.candidatoService.getCandidatoById(this.candidatoId).subscribe({
      next: (candidato) => {
        console.log('Data recebida da API:', candidato.dataNascimento);
        this.form.patchValue({
          nome: candidato.nome,
          email: candidato.email,
          telefone: candidato.telefone,
          dataNascimento: candidato.dataNascimento
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

  // Verifica se o usuário é maior de idade
  const dataNascimento = this.form.get('dataNascimento')?.value;
  if (!this.verificarMaiorDeIdade(dataNascimento)) {
    alert('Você deve ter pelo menos 18 anos.');
    return;
  }

  const candidatoAtualizado = {
    id: this.candidatoId,
    ...this.form.value
  };

  this.candidatoService.updateCandidato(candidatoAtualizado).subscribe({
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
      this.candidatoService.deleteCandidato(this.candidatoId).subscribe({
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