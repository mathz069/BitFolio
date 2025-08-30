import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';
import { Candidato } from 'src/app/models/candidato';
import { CandidatoService } from 'src/app/shared/services/candidato.service';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {

form: FormGroup;
editando = false;
candidatoId: number;

  constructor(
    private fb: FormBuilder, 
    private candidatoService: CandidatoService, 
    private authService: AuthService,
    private router: Router
  ) {}

ngOnInit(): void {
  this.form = this.fb.group({
    nome: [''],
    email: [''],
    dataNascimento: [''],
    telefone: [''],
    curriculo: ['']
  });

  this.toggleFormState(); 

  const id = this.authService.obterUsuarioId();
  if (id !== null) {
    this.candidatoId = id;
    this.carregarCandidato();
  } else {
    console.error('ID do candidato não encontrado no token.');
  }
}

  toggleEdicao(): void {
    this.editando = !this.editando;
    this.toggleFormState();

    if (!this.editando) {
    }
  }
 carregarCandidato(): void {
    this.candidatoService.getCandidatoById(this.candidatoId).subscribe({
      next: (candidato: Candidato) => {
        this.form.patchValue({
          nome: candidato.nome,
          email: candidato.email,
          dataNascimento: candidato.dtNascimento,
          telefone: candidato.telefone,
          curriculo: candidato.curriculo ?? ''
        });
      },
      error: err => {
        console.error('Erro ao buscar candidato:', err);
      }
    });
  }
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
public atualizarDados(): void {
    if (this.form.invalid) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }
  }
  private toggleFormState(): void {
    if (this.editando) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }
}





