import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RegisterCandidato } from '../models/registerUsuario';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  passwordField: string = 'password';
  confirmPasswordField: string = 'password'
  eyeSourcePassword: string = './assets/images/invisibility.svg'; 
  eyeSourceConfirmPassword: string = './assets/images/invisibility.svg';
  errorMessage: string = '';
  isSubmitting: boolean = false;
  step: number = 1;
  selectedFile: File | null = null; 
  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,  
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, this.passwordStrengthValidator]],
    confirmarSenha: ['', Validators.required],
    dataNascimento: ['', [Validators.required, this.ageValidator]],
    telefone: ['', Validators.required],
    curriculo: ['', Validators.required]
  }, {
    validator: this.passwordMatchValidator // 
  });
  }

passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    // Checando se a senha tem pelo menos 8 caracteres
    const hasMinLength = password && password.length >= 8;
    // Verificando se a senha contém pelo menos 1 letra maiúscula
    const hasUpperCase = /[A-Z]/.test(password);
    // Verificando se a senha contém pelo menos 1 letra minúscula
    const hasLowerCase = /[a-z]/.test(password);
    // Verificando se a senha contém pelo menos 1 caractere especial
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    // Se todos os critérios forem atendidos, a senha é válida
    if (hasMinLength && hasUpperCase && hasLowerCase && hasSpecialChar) {
      return null;  // Senha válida
    } else {
      return { passwordStrength: true };  // Senha inválida
    }
  }

  ageValidator(control: AbstractControl): ValidationErrors | null {
  const birthDate = new Date(control.value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 16) {
    return { ageInvalid: true }; // Se a idade for menor que 16 anos
  }
  return null; // Se a idade for válida
}

passwordMatchValidator(group: FormGroup): ValidationErrors | null {
  const password = group.get('senha') ? group.get('senha')!.value : '';
  const confirmPassword = group.get('confirmarSenha') ? group.get('confirmarSenha')!.value : '';

  return password === confirmPassword ? null : { passwordMismatch: true };
}
nextStep(): void {
  debugger
    // Validação da primeira etapa (nome, e-mail, senha e confirmar senha)
    const nome = this.form.get('nome');
    const email = this.form.get('email');
    const password = this.form.get('senha');
    const confirmpassword = this.form.get('confirmarSenha');

    if (nome && email && password && confirmpassword) {
      if (nome.valid && email.valid && password.valid && confirmpassword.valid && password.value === confirmpassword.value) {
        this.step = 2;  // Se estiver tudo certo, avança para a segunda etapa
      } else {
        alert('Por favor, preencha todos os campos corretamente na primeira etapa.');
      }
    }
  }
  previousStep() {
    this.step = 1;
  }
 setBorder(controlName: string): string {
  const control = this.form.get(controlName);
  return control && control.invalid && control.touched ? '1px solid red' : '1px solid #ccc';
}

changeFieldType(event: Event, field: 'password' | 'confirmPassword') {
    event.preventDefault();
    
    if (field === 'password') {
        if (this.passwordField === 'text') {
            this.passwordField = 'password';
            this.eyeSourcePassword = './assets/images/invisibility.svg';
        } else {
            this.passwordField = 'text';
            this.eyeSourcePassword = './assets/images/visibility.svg';
        }
    } else if (field === 'confirmPassword') {
        if (this.confirmPasswordField === 'text') {
            this.confirmPasswordField = 'password';
            this.eyeSourceConfirmPassword = './assets/images/invisibility.svg';
        } else {
            this.confirmPasswordField = 'text';
            this.eyeSourceConfirmPassword = './assets/images/visibility.svg';
        }
    }
}
onFileSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0]; // Aqui o 'file' já é um Blob

    if (file.type !== 'application/pdf') {
      this.errorMessage = 'O arquivo deve ser um PDF.';
      this.selectedFile = null;
    } else {
      this.selectedFile = file; // Esse 'file' é um Blob
      this.errorMessage = '';
    }
  }
}
transformNome(nome: string): string {
  return nome
    .split(' ') 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
    .join(' '); 
}
transformEmail(email: string): string {
  return email.toLowerCase(); 
}
onSubmit() {
  debugger;
  if (this.form.invalid || !this.selectedFile) {
    this.errorMessage = 'Preencha todos os campos e selecione um currículo em PDF.';
    return;
  }

  this.isSubmitting = true;

  const formValues = this.form.value;

  const candidato: RegisterCandidato = {
    nome: this.transformNome(formValues.nome), 
    email: this.transformEmail(formValues.email), 
    senha: formValues.senha,
    dataNascimento: formValues.dataNascimento,
    telefone: formValues.telefone,
    curriculoPdf: this.selectedFile
  };


  this.authService.registerUsuario(candidato).subscribe({
  next: (response) => {
    console.log('Cadastro realizado com sucesso!', response); // Verificando a resposta
    alert('Cadastro realizado com sucesso!');
    this.form.reset();
    this.selectedFile = null;
    this.isSubmitting = false;
    this.router.navigate(['/login']);
  },
  error: (error) => {
    console.error('Erro ao registrar: ', error); // Verificando o erro
    this.errorMessage = 'Erro ao registrar. Verifique os dados.';
    this.isSubmitting = false;
  }
});
}
}