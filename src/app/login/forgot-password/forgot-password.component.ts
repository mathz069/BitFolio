import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UsertypeService } from '../services/usertype.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  passwordField: string = 'password';
  confirmPasswordField: string = 'newpassword';
  eyeSourcePassword: string = './assets/images/invisibility.svg';
  eyeSourceConfirmPassword: string = './assets/images/invisibility.svg';
  errorMessage: string = '';
  step: number = 1;
  isSubmitting: boolean = false;
  capsLockOn: boolean = false;
  capsLockOn1: boolean = false;
  userTypeData$: Observable<{ backgroundColor: string, backgroundImage: string }>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userTypeService: UsertypeService
  ) {
    this.userTypeData$ = this.userTypeService.userTypeData$;
  }

  ngOnInit(): void {
    const userType = localStorage.getItem('userType') as 'candidato' | 'administrador' | 'funcionario' || 'candidato';
    this.setPrimaryColor(userType);
    this.form = this.fb.group({
     email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)
        ]
      ],
      codigo: ['', this.step === 2 ? Validators.required : []],
      novaSenha: ['', [Validators.required, this.passwordStrengthValidator]],
      ConfirmarnovaSenha: ['', [Validators.required, this.passwordStrengthValidator]]

    });
  }
  setPrimaryColor(userType: 'candidato' | 'administrador' | 'funcionario') {
  const root = document.documentElement;

  const colors: Record<typeof userType, string> = {
    candidato: '#044894',
    administrador: '#940404',
    funcionario: '#940445'
  };

  root.style.setProperty('--primary-color', colors[userType]);
}
  setBorder(controlName: string): string {
    const control = this.form.get(controlName);
    return control && control.invalid && control.touched ? '1px solid red' : '1px solid #ccc';
  }

   checkCaps(event: KeyboardEvent) {
  if (!event.getModifierState) return; 

  this.capsLockOn = event.getModifierState('CapsLock');
}
 checkCaps1(event: KeyboardEvent) {
  if (!event.getModifierState) return; 

  this.capsLockOn1 = event.getModifierState('CapsLock');
}

  changeFieldType(event: Event, field: 'password' | 'newpassword') {
    event.preventDefault();
    
    if (field === 'password') {
        if (this.passwordField === 'text') {
            this.passwordField = 'password';
            this.eyeSourcePassword = './assets/images/invisibility.svg';
        } else {
            this.passwordField = 'text';
            this.eyeSourcePassword = './assets/images/visibility.svg';
        }
    } else if (field === 'newpassword') {
        if (this.confirmPasswordField === 'text') {
            this.confirmPasswordField = 'password';
            this.eyeSourceConfirmPassword = './assets/images/invisibility.svg';
        } else {
            this.confirmPasswordField = 'text';
            this.eyeSourceConfirmPassword = './assets/images/visibility.svg';
        }
    }
}

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasUpperCase && hasLowerCase && hasSpecialChar
      ? null
      : { passwordStrength: true };
  }

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
  const password = group.get('novaSenha') ? group.get('novaSenha')!.value : '';
  const confirmPassword = group.get('ConfirmarnovaSenha') ? group.get('ConfirmarnovaSenha')!.value : '';

  return password === confirmPassword ? null : { passwordMismatch: true };
}
  enviarCodigo() {
    const email = this.form.get('email').value;
    if (!email) return;

    this.authService.solicitarRecuperacaoSenha(email).subscribe({
      next: () => {
        this.step = 2;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao enviar código de recuperação. Verifique o e-mail.';
        console.error(err);
      }
    });
  }

  previousStep() {
    this.step = 1;
  }

  redefinirSenha() {
    if (this.form.invalid) return;

    const dto = this.form.value;
    this.isSubmitting = true;
    this.authService.redefinirSenha(dto).subscribe({
      next: () => {
        alert('Senha redefinida com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Erro ao redefinir senha. Verifique os dados.';
        console.error(err);
        this.isSubmitting = false;
      }
    });
  }
}