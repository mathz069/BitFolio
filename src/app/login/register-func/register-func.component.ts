import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterFuncionario } from '../models/registerUsuario';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material';
import { EmpresaModalComponent } from '../modal/empresa-modal/empresa-modal.component';
import { Empresa } from '../models/empresa';
import { EmpresaService } from '../services/empresa.service';

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
       cargo: ['', Validators.required],
       dtAdmissao: ['', Validators.required],
       negocioId: [null, Validators.required]
     }, { validator: this.passwordMatchValidator });
   }
 
 loadEmpresas(): void {
   this.loadingEmpresas = true;
   this.empresaService.getEmpresas().subscribe({
     next: (data) => {
       this.empresas = data.map(e => ({
         id: Number(e.id), 
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
       this.form.get('negocioId').setValue(novaEmpresa.id);
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

    this.isSubmitting = true;

    const formValues = this.form.value;
    const funcionario: RegisterFuncionario = {
      nome: this.transformNome(formValues.nome),
      email: this.transformEmail(formValues.email),
      senha: formValues.senha,
      dataNascimento: formValues.dataNascimento,
      telefone: formValues.telefone,
      cargo: formValues.cargo,
      dtAdmissao: formValues.dtAdmissao,
      negocioId: formValues.negocioId
    };

    this.authService.registerFuncionario(funcionario).subscribe({
      next: (res) => {
        alert('Funcionário cadastrado com sucesso!');
        this.form.reset();
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro ao registrar funcionário:', err);
        this.errorMessage = 'Erro ao registrar. Verifique os dados.';
        this.isSubmitting = false;
      }
    });
  }
}