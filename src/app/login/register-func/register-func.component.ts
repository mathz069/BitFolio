import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterFuncionario } from '../models/registerUsuario';
import { AuthService } from '../services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmpresaModalComponent } from '../modal/empresa-modal/empresa-modal.component';
import { Empresa } from '../models/empresa';
import { EmpresaService } from '../services/empresa.service';
import { TermosUsoComponent } from 'src/app/perfil/termos-uso/termos-uso.component';

@Component({
  selector: 'app-register-func',
  templateUrl: './register-func.component.html',
  styleUrls: ['./register-func.component.css']
})
export class RegisterFuncComponent implements OnInit {
  form: FormGroup;
   step: number = 1;
   passwordField: string = 'password';
   confirmPasswordField: string = 'password';
   eyeSourcePassword: string = './assets/images/invisibility.svg';
   eyeSourceConfirmPassword: string = './assets/images/invisibility.svg';
   errorMessage: string = '';
   isSubmitting: boolean = false;
   empresas: any[] = [];
   loadingEmpresas = false;
   empresaSelecionada: any;
   capsLockOn: boolean = false;
   capsLockOn1: boolean = false;
   constructor(
     private fb: FormBuilder,
     private authService: AuthService,
     private empresaService: EmpresaService,
     private router: Router,
     private dialog: MatDialog
   ) {}
 
   ngOnInit(): void {
     this.loadEmpresas();
 
     this.form = this.fb.group({
       nome: ['', Validators.required],
       email: ['', [Validators.required, Validators.email]],
       senha: ['', [Validators.required, this.passwordStrengthValidator]],
       confirmarSenha: ['', Validators.required],
       dataNascimento: ['', [Validators.required, this.ageValidator]],
       telefone: ['', Validators.required],
      termosAceitos: [false, Validators.requiredTrue],
       negocioId: [null, Validators.required]
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
    titulo: 'TERMOS DE USO - FUNCIONÁRIO BITFOLIO',
    mensagem: `
<span class="titulo-header">I. TERMOS DE USO</span><br><br>

<span class="titulo-item">1. Função do Funcionário</span><br>
O Funcionário cadastrado por uma empresa utiliza a plataforma BitFolio para gerenciar vagas e analisar candidaturas, incluindo:<br>
• Criação, edição e encerramento de vagas da empresa à qual está vinculado.<br>
• Gerenciamento e análise de candidaturas recebidas para as vagas da empresa.<br>
• Edição de dados da empresa e endereço, mediante aprovação da empresa via e-mail.<br><br>

<span class="titulo-item">2. Acesso aos Dados</span><br>
O Funcionário declara estar ciente de que:<br><br>

<span class="titulo-item">2.1. Dados de Candidatos</span><br>
• Poderá visualizar nome, telefone, e-mail e currículo completo apenas dos candidatos que se candidataram às vagas da empresa na qual trabalha.<br>
• Não terá acesso a candidatos de outras empresas.<br><br>

<span class="titulo-item">2.2. Dados da Empresa</span><br>
• O Funcionário poderá acessar e, quando autorizado, editar informações da empresa à qual está vinculado, incluindo endereço e dados gerais.<br>
• Todas as alterações significativas devem ser aprovadas pela empresa via e-mail.<br>
• Não terá acesso a informações de outras empresas ou seus funcionários.<br><br>

<span class="titulo-item">3. Responsabilidades do Funcionário</span><br>
O Funcionário concorda em:<br>
• Utilizar os dados dos candidatos exclusivamente para processos seletivos e comunicação interna da empresa.<br>
• Manter a confidencialidade das informações de candidatos e da empresa.<br>
• Não compartilhar ou divulgar dados pessoais sem consentimento.<br>
• Fornecer informações verdadeiras e atualizadas ao criar e gerenciar vagas.<br>
• Cumprir a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).<br>
• Reportar imediatamente qualquer uso indevido, falha ou incidente de segurança.<br><br>

O uso inadequado da plataforma poderá resultar em:<br>
• Suspensão ou exclusão da conta do funcionário;<br>
• Perda de acesso a dados de candidatos e vagas;<br>
• Responsabilização civil, administrativa ou legal.<br><br>

<span class="titulo-item">4. Exclusão e Alteração de Conta e Vagas</span><br>
O Funcionário pode alterar seus dados pessoais a qualquer momento. Para excluir a conta:<br>
• Todos os dados pessoais serão removidos.<br>
• O acesso à plataforma será revogado.<br><br>

Quando uma vaga for deletada pelo funcionário:<br>
• Todas as candidaturas e histórico de candidatos daquela vaga serão permanentemente perdidos.<br><br>

Solicitações de alteração ou exclusão podem ser feitas através do e-mail:<br>
<b>suporte.bitfolio@gmail.com</b><br><br>

<span class="titulo-item">5. Limitações de Responsabilidade</span><br>
O Funcionário reconhece que:<br>
• O BitFolio atua como intermediador tecnológico, não sendo responsável pelos processos seletivos ou decisões da empresa.<br>
• A integridade e exatidão das informações exibidas dependem da atualização feita por candidatos e empresas.<br>
• Nenhuma plataforma é totalmente imune a incidentes, mas medidas de segurança são adotadas para proteção dos dados.<br><br>

<span class="titulo-header">II. DISPOSIÇÕES FINAIS</span><br><br>
O BitFolio pode atualizar este documento a qualquer momento, respeitando os princípios da transparência.<br>
O uso contínuo da plataforma após as atualizações implica aceitação automática das novas condições.<br>`,
    botaoTexto: 'Fechar'
  };
    this.dialog.open(TermosUsoComponent, config);
  }
  
 loadEmpresas(): void {
  this.loadingEmpresas = true;
  this.empresaService.getEmpresas().subscribe({
    next: (data) => {
      this.empresas = data.map(e => ({
        id: e.empresaId,   
        nome: e.nome
      }));
      this.loadingEmpresas = false;
    },
    error: () => {
      this.empresas = [];
      this.loadingEmpresas = false;
    }
  });
}

 
 
  setBorder(controlName: string): string {
   const control = this.form.get(controlName);
   return control && control.invalid && control.touched ? '1px solid red' : '1px solid #ccc';
 }
   nextStep(): void {
     const nome = this.form.get('nome');
     const email = this.form.get('email');
     const senha = this.form.get('senha');
     const confirmarSenha = this.form.get('confirmarSenha');
 
 if (
     (nome && nome.valid) &&
     (email && email.valid) &&
     (senha && senha.valid) &&
     (confirmarSenha && confirmarSenha.valid) &&
     senha.value === confirmarSenha.value
   ) {      this.step = 2;
     } else {
       alert('Preencha corretamente os campos da primeira etapa.');
     }
   }
 
   previousStep(): void {
     this.step = 1;
   }
   openEmpresaModal() {
     const dialogRef = this.dialog.open(EmpresaModalComponent, {
       width: '600px',
       disableClose: true
     });
 
     dialogRef.componentInstance.empresaCriada.subscribe((novaEmpresa: Empresa) => {
       this.empresas.push(novaEmpresa);
       this.form.get('negocioId').setValue(novaEmpresa.empresaId);
       dialogRef.close();
     });
 
     dialogRef.componentInstance.closeModal.subscribe(() => {
       dialogRef.close();
     });
   }
   customSearchFn(term: string, item: any): boolean {
   term = term.toLowerCase();
   return item.nome.toLowerCase().includes(term);
 }
 

 
   changeFieldType(event: Event, field: 'password' | 'confirmPassword'): void {
     event.preventDefault();
     if (field === 'password') {
       this.passwordField = this.passwordField === 'text' ? 'password' : 'text';
       this.eyeSourcePassword = this.passwordField === 'text'
         ? './assets/images/visibility.svg'
         : './assets/images/invisibility.svg';
     } else {
       this.confirmPasswordField = this.confirmPasswordField === 'text' ? 'password' : 'text';
       this.eyeSourceConfirmPassword = this.confirmPasswordField === 'text'
         ? './assets/images/visibility.svg'
         : './assets/images/invisibility.svg';
     }
   }
 
   passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
     const password = control.value;
     const isValid = password.length >= 8 &&
                     /[A-Z]/.test(password) &&
                     /[a-z]/.test(password) &&
                     /[!@#$%^&*(),.?":{}|<>]/.test(password);
     return isValid ? null : { passwordStrength: true };
   }
 
   passwordMatchValidator(group: FormGroup): ValidationErrors | null {
     const senha = group.get('senha').value;
     const confirmarSenha = group.get('confirmarSenha').value;
     return senha === confirmarSenha ? null : { passwordMismatch: true };
   }
 
   ageValidator(control: AbstractControl): ValidationErrors | null {
     const birthDate = new Date(control.value);
     const today = new Date();
     let age = today.getFullYear() - birthDate.getFullYear();
     const month = today.getMonth() - birthDate.getMonth();
     if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) age--;
     return age < 18 ? { ageInvalid: true } : null;
   }
 
   transformNome(nome: string): string {
     return nome.split(' ')
       .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
       .join(' ');
   }
 
   transformEmail(email: string): string {
     return email.toLowerCase();
   }
 
  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Preencha todos os campos obrigatórios.';
      return;
    }

    if (this.isSubmitting) return; // evita duplo clique
    this.isSubmitting = true;

    const formValues = this.form.value;
    const funcionario: RegisterFuncionario = {
      nome: this.transformNome(formValues.nome),
      email: this.transformEmail(formValues.email),
      senha: formValues.senha,
      dataNascimento: formValues.dataNascimento,
      telefone: formValues.telefone,
      empresaId: formValues.negocioId
    };
    console.log(funcionario)
    this.authService.registerFuncionario(funcionario).subscribe({
      next: (res) => {
        alert('Funcionário cadastrado com sucesso! Aguarde a aprovação da empresa.');
        this.router.navigate(['/login']);
        this.form.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Erro ao registrar funcionário:', err);
        this.errorMessage = 'Erro ao registrar. Verifique os dados.';
        this.isSubmitting = false;
      }
    });
  }
}