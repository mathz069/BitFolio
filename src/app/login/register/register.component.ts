import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RegisterCandidato } from '../models/registerUsuario';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TermosUsoComponent } from 'src/app/perfil/termos-uso/termos-uso.component';

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
  capsLockOn: boolean = false;
  capsLockOn1: boolean = false;
  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,  
    private authService: AuthService, 
    private router: Router,
    private dialog: MatDialog
    
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, this.passwordStrengthValidator]],
    confirmarSenha: ['', Validators.required],
    dataNascimento: ['', [Validators.required, this.ageValidator]],
    telefone: ['', Validators.required],
    termosAceitos: [false, Validators.requiredTrue]
       }, { validators: this.passwordMatchValidator });

  }
 checkCaps(event: KeyboardEvent) {
  if (!event.getModifierState) return; 

  this.capsLockOn = event.getModifierState('CapsLock');
}
 checkCaps1(event: KeyboardEvent) {
  if (!event.getModifierState) return; 

  this.capsLockOn1 = event.getModifierState('CapsLock');
}

abrirTermos(event: MouseEvent) {
    event.stopPropagation();

    const config = new MatDialogConfig();
    config.width = '900px';
    config.maxWidth = '87%';
    config.disableClose = true;
    config.autoFocus = true;
    config.panelClass = 'custom-termo-panel';
    config.backdropClass = 'custom-2fa-backdrop';
  
    config.data = {
    titulo: 'TERMOS DE USO - CANDIDATO BITFOLIO',
    mensagem: `
<span class="titulo-header">I. TERMOS DE USO</span><br><br>

<span class="titulo-item">1. Função do Candidato</span><br>
O Candidato utiliza a plataforma BitFolio para gerenciar suas candidaturas e informações pessoais, incluindo:<br>
• Aplicação a vagas de emprego disponíveis na plataforma.<br>
• Atualização de informações pessoais, incluindo nome, telefone, e-mail e endereço (opcional, utilizado para busca de vagas próximas).<br>
• Inserção e atualização de seu currículo, necessário apenas para candidatura às vagas.<br><br>

<span class="titulo-item">2. Acesso aos Dados</span><br>
O Candidato declara estar ciente de que:<br><br>

<span class="titulo-item">2.1. Seus Dados Pessoais</span><br>
• Serão utilizados para processar candidaturas, comunicação com empresas e envio de notificações relevantes.<br>
• Nome, telefone, e-mail e informações do currículo poderão ser visualizados pelos funcionários das empresas às quais ele se candidatar.<br><br>

<span class="titulo-item">2.2. Dados de Vagas e Empresas</span><br>
• O Candidato terá acesso a informações sobre as vagas, incluindo descrição do cargo, requisitos e benefícios.<br>
• Poderá visualizar o nome e endereço das empresas, mas não terá acesso a informações confidenciais adicionais.<br><br>

<span class="titulo-item">3. Responsabilidades do Candidato</span><br>
O Candidato concorda em:<br>
• Fornecer informações verdadeiras, completas e atualizadas em seu perfil e currículo.<br>
• Não compartilhar sua conta ou credenciais com terceiros.<br>
• Utilizar a plataforma de forma ética e responsável.<br>
• Respeitar a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).<br><br>

O uso inadequado da plataforma poderá resultar em:<br>
• Suspensão ou exclusão da conta;<br>
• Exclusão das candidaturas associadas à conta;<br>
• Responsabilização civil ou administrativa, quando aplicável.<br><br>

<span class="titulo-item">4. Exclusão e Alteração de Conta</span><br>
O Candidato pode alterar seus dados pessoais a qualquer momento. Caso deseje excluir sua conta:<br>
• Todas as candidaturas associadas também serão excluídas.<br>
• O processo poderá ser solicitado diretamente através do e-mail:<br>
<b>suporte.bitfolio@gmail.com</b><br><br>

Após a confirmação interna:<br>
• O acesso à conta será revogado;<br>
• Todos os dados pessoais serão removidos do ambiente operacional.<br><br>

<span class="titulo-item">5. Limitações de Responsabilidade</span><br>
O Candidato reconhece que:<br>
• O BitFolio atua apenas como intermediador tecnológico.<br>
• A integridade e exatidão das informações exibidas dependem da atualização feita pelos usuários.<br>
• Nenhuma plataforma é totalmente imune a incidentes, mas medidas de segurança são adotadas para proteção dos dados.<br><br>

<span class="titulo-header">II. DISPOSIÇÕES FINAIS</span><br><br>
O BitFolio pode atualizar este documento a qualquer momento, respeitando os princípios da transparência. <br>
O uso contínuo da plataforma após as atualizações implica aceitação automática das novas condições.<br>`,
    botaoTexto: 'Fechar'
  };
  
    this.dialog.open(TermosUsoComponent, config);
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
  if (this.form.invalid) {
    this.errorMessage = 'Preencha todos os campos';
    return;
  }

  if (this.isSubmitting) return; // evita duplo clique
    this.isSubmitting = true;

  const formValues = this.form.value;

  const candidato: RegisterCandidato = {
    nome: this.transformNome(formValues.nome), 
    email: this.transformEmail(formValues.email), 
    senha: formValues.senha,
    dataNascimento: formValues.dataNascimento,
    telefone: formValues.telefone,
  };


  this.authService.registerUsuario(candidato).subscribe({
  next: (response) => {
    alert('Cadastro realizado com sucesso! Verifique seu e-mail para ativar a conta.');
    this.router.navigate(['/login']);
    this.form.reset();
    this.isSubmitting = false;
  },
  error: (error) => {
    console.error('Erro ao registrar: ', error); // Verificando o erro
    this.errorMessage = 'Erro ao registrar. Verifique os dados.';
    this.isSubmitting = false;
  }
});
}
}