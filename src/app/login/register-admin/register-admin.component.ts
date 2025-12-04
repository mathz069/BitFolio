import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterAdministrador } from '../models/registerUsuario';
import { AuthService } from '../services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Empresa } from '../models/empresa';
import { EmpresaModalComponent } from '../modal/empresa-modal/empresa-modal.component';
import { EmpresaService } from '../services/empresa.service';
import { TermosUsoComponent } from 'src/app/perfil/termos-uso/termos-uso.component';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css']
})
export class RegisterAdminComponent implements OnInit {
  termosAceitos = false;
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
loadEmpresas(): void {
  this.loadingEmpresas = true;
  this.empresaService.getEmpresas().subscribe({
    next: (data) => {
      this.empresas = data.map(e => ({
        id: Number(e.empresaId),  
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

onEmpresaSelecionada(event: any) {
  const id = typeof event === 'object' ? event.id : event;
  console.log('ID selecionado:', id);
  this.form.get('negocioId').setValue(id);
}

onLimparEmpresa() {
  this.form.get('negocioId').setValue(null);
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
    const values = this.form.value;

    const admin: RegisterAdministrador = {
      nome: this.transformNome(values.nome),
      email: this.transformEmail(values.email),
      senha: values.senha,
      dataNascimento: values.dataNascimento,
      telefone: values.telefone,
      
    };

    this.authService.registerAdmin(admin).subscribe({
      next: () => {
        alert('Administrador cadastrado com sucesso! Aguarde a aprovação da equipe BitFolio.');
        this.router.navigate(['/login']);
        this.form.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao registrar administrador.';
        this.isSubmitting = false;
      }
    });
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
      titulo: 'TERMOS DE USO ADMINISTRADOR- BITFOLIO',
      mensagem: `
  <span class="titulo-header">I. TERMOS DE USO</span><br><br>
  
  <span class="titulo-item">1. Função do Administrador</span><br>
  O Administrador é responsável pela gestão interna da plataforma BitFolio, incluindo:<br>
  • Moderação, aprovação e reprovação de empresas, funcionários e candidatos cadastradas.<br>
  • Acompanhamento operacional da plataforma.<br>
  • Suporte interno aos usuários.<br>
  • Verificação de inconsistências, uso indevido e manutenção da integridade dos dados.<br><br>
  
  <span class="titulo-item">2. Acesso aos Dados</span><br>
  O Administrador declara estar ciente de que possui acesso a informações específicas e limitadas, conforme descrito abaixo:<br><br>
  
  <span class="titulo-item">2.1. Dados de Candidatos e Funcionários</span><br>
  O Administrador poderá visualizar:<br>
  • Dados anonimizados de candidatos e funcionários para garantir conformidade do sistema.<br>
  • Dados agregados utilizados para monitoramento do sistema, sem identificação direta dos usuários.<br>
  O Administrador não terá acesso ao conteúdo completo de perfis, currículos ou informações pessoais de forma nominal.<br><br>
  
  <span class="titulo-item">2.2. Dados de Empresas</span><br>
  O Administrador poderá visualizar:<br>
  • Dados completos de empresas cadastradas.<br>
  • Dados de responsáveis vinculados a cada empresa.<br>
  • Informações referentes ao processo de aprovação, reprovação e status da empresa.<br><br>
  
  <span class="titulo-item">2.3. Dados de Outros Administradores</span><br>
  Para fins de auditoria, segurança e integridade da plataforma, o Administrador poderá visualizar:<br>
  • Nome, e-mail e telefone de outros administradores.<br><br>
  
  <span class="titulo-item">3. Responsabilidades do Administrador</span><br>
  O Administrador concorda em:<br>
  • Utilizar os dados exclusivamente para fins operacionais e administrativos.<br>
  • Não compartilhar, redistribuir, copiar ou divulgar informações internas da plataforma.<br>
  • Respeitar integralmente a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).<br>
  • Agir com confidencialidade, ética profissional e responsabilidade.<br>
  • Reportar imediatamente qualquer falha, violação de segurança ou acesso indevido.<br><br>
  
  O uso inadequado de dados confidenciais poderá resultar em:<br>
  • Revogação imediata do acesso administrativo;<br>
  • Responsabilização civil e administrativa;<br>
  • Ações legais, quando aplicável.<br><br>
  
  <span class="titulo-item">4. Exclusão da Conta de Administrador</span><br>
  Caso um Administrador deseje encerrar sua conta, o processo não é automático.<br>
  A solicitação deverá ser enviada formalmente para:<br>
  <b>administrativo.bitfolio@gmail.com</b><br><br>
  
  Após a confirmação interna:<br>
  • O acesso será revogado;<br>
  • Os dados pessoais serão removidos do ambiente operacional;<br><br>
  
  <span class="titulo-item">5. Limitações de Responsabilidade</span><br>
  O Administrador reconhece que:<br>
  • O BitFolio atua como intermediador tecnológico.<br>
  • Métricas e dados exibidos possuem caráter informativo e podem depender de atualizações feitas pelos usuários.<br>
  • A integridade e confidencialidade dos dados são priorizadas, mas nenhuma plataforma é totalmente imune a incidentes.<br><br>
  
  <span class="titulo-header">II. DISPOSIÇÕES FINAIS</span><br><br>
  O BitFolio pode atualizar este documento a qualquer momento, respeitando os princípios da transparência. <br>
  O uso contínuo da plataforma após as atualizações implica aceitação automática das novas condições.<br>`,
      botaoTexto: 'Fechar'
    };
  
    this.dialog.open(TermosUsoComponent, config);
  }
}