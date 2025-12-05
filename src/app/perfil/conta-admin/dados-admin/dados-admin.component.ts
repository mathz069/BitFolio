import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)
        ]
      ],
      telefone: ['', Validators.required],
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
      this.adminId = id;
      this.carregarAdmin();
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