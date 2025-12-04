import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';
import { CandidatoService } from 'src/app/shared/services/candidato.service';
import { EnderecoModalComponent } from 'src/app/vagas/vagas/endereco-modal/endereco-modal.component';

@Component({
  selector: 'app-meus-dados',
  templateUrl: './meus-dados.component.html',
  styleUrl: './meus-dados.component.css'
})
export class DadosComponent implements OnInit {

  form: FormGroup;
  editando = false;
  candidatoId: string;
  formSenha: FormGroup;
    senhaAtualField: string = "password";
  novaSenhaField: string = "password";
  confirmarSenhaField: string = "password";

  // Ícones
  eyeSenhaAtual: string = "./assets/images/invisibility.svg";
  eyeNovaSenha: string = "./assets/images/invisibility.svg";
  eyeConfirmarSenha: string = "./assets/images/invisibility.svg";

// Caps Lock status
capsAtual: boolean = false;
capsNova: boolean = false;
capsConfirmar: boolean = false;
  constructor(
    private fb: FormBuilder,
    private candidatoService: CandidatoService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      dataNascimento: ['', [Validators.required, this.verificarMaiorDeIdade]]
    });
    this.formSenha = this.fb.group({
      senhaAtual: ['', [Validators.required, this.passwordStrengthValidator]],
      novaSenha: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmarSenha: ['', [Validators.required, this.passwordStrengthValidator]],
    }, {
    validator: this.passwordMatchValidator 
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

  changeFieldType(event: Event, field: string) {
  event.preventDefault();

  switch (field) {
    case "senhaAtual":
      this.senhaAtualField = this.senhaAtualField === "password" ? "text" : "password";
      this.eyeSenhaAtual =
        this.senhaAtualField === "password"
          ? "./assets/images/invisibility.svg"
          : "./assets/images/visibility.svg";
      break;

    case "novaSenha":
      this.novaSenhaField = this.novaSenhaField === "password" ? "text" : "password";
      this.eyeNovaSenha =
        this.novaSenhaField === "password"
          ? "./assets/images/invisibility.svg"
          : "./assets/images/visibility.svg";
      break;

    case "confirmarSenha":
      this.confirmarSenhaField = this.confirmarSenhaField === "password" ? "text" : "password";
      this.eyeConfirmarSenha =
        this.confirmarSenhaField === "password"
          ? "./assets/images/invisibility.svg"
          : "./assets/images/visibility.svg";
      break;
  }
}

checkCapsAtual(event: KeyboardEvent) {
  if (!event.getModifierState) return; 

  this.capsAtual = event.getModifierState("CapsLock");
}


checkCapsNova(event: KeyboardEvent) {
  if (!event.getModifierState) return; 

  this.capsNova = event.getModifierState("CapsLock");
}

checkCapsConfirmar(event: KeyboardEvent) {
  if (!event.getModifierState) return;
  this.capsConfirmar = event.getModifierState("CapsLock");
}

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
  const password = group.get('novaSenha') ? group.get('novaSenha')!.value : '';
  const confirmPassword = group.get('confirmarSenha') ? group.get('confirmarSenha')!.value : '';

  return password === confirmPassword ? null : { passwordMismatch: true };
}


  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
      const password = control.value;
      const hasMinLength = password && password.length >= 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      if (hasMinLength && hasUpperCase && hasLowerCase && hasSpecialChar) {
        return null;  
      } else {
        return { passwordStrength: true };  
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

  alterarSenha(): void {
  if (this.formSenha.invalid) {
    alert('Preencha todos os campos corretamente antes de continuar.');
    return;
  }

  const email = this.form.get('email')?.value; 

  const dto = {
    email: email,
    senhaAtual: this.formSenha.get('senhaAtual')?.value,
    novaSenha: this.formSenha.get('novaSenha')?.value,
    confirmacaoNovaSenha: this.formSenha.get('confirmarSenha')?.value
  };

  this.authService.alterarSenha(dto).subscribe({
    next: () => {
      alert('Senha alterada com sucesso!');
      this.formSenha.reset();
    },
    error: (err) => {
      console.error('Erro ao alterar senha:', err);
      alert(err.error?.mensagem || 'Erro ao alterar senha.');
    }
  });
}

/** Deleta o candidato logado com confirmação via modal */
deletarCandidato(): void {
  const config = new MatDialogConfig();
  config.width = '600px';
  config.maxWidth = '87%';
  config.disableClose = true;
  config.autoFocus = true;
  config.panelClass = 'custom-2fa-panel';
  config.backdropClass = 'custom-2fa-backdrop';
  config.data = {
    mensagem: 'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita. Suas candidaturas serão canceladas e seus dados removidos permanentemente.',
    botaoTexto: 'Excluir'
  };

  const dialogRef = this.dialog.open(EnderecoModalComponent, config);

  dialogRef.afterClosed().subscribe((confirmado: boolean) => {
    if (confirmado) {
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
  });
}

}