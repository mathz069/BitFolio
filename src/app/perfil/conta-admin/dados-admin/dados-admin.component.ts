import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { CandidatoService } from 'src/app/shared/services/candidato.service';

@Component({
  selector: 'app-dados-admin',

  templateUrl: './dados-admin.component.html',
  styleUrl: './dados-admin.component.css'
})
export class DadosAdminComponent {

  form: FormGroup;
  editando = false;
  adminId: string;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
    });

    this.toggleFormState();

    const id = this.authService.obterUsuarioId();
    if (id) {
      this.adminId = id;
      this.carregarAdmin();
    } else {
      console.error('ID do candidato não encontrado no token.');
    }
  }

  /** Carrega dados do candidato logado */
  carregarAdmin(): void {
    this.adminService.getAdministradorById(this.adminId).subscribe({
      next: (candidato) => {
        this.form.patchValue({
          nome: candidato.nome,
          email: candidato.email,
          telefone: candidato.telefone,
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

 
  /** Atualiza os dados do candidato */
  atualizarDados(): void {
  if (this.form.invalid) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  const adminAtualizado = {
    id: this.adminId,
    ...this.form.value
  };

  this.adminService.updateAdministrador(adminAtualizado).subscribe({
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
}