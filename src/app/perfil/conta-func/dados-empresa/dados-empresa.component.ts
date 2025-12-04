import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';
import { EmpresaService } from 'src/app/login/services/empresa.service';
import { FuncionarioService } from 'src/app/shared/services/funcionario.service';

@Component({
  selector: 'app-dados-empresa',
  templateUrl: './dados-empresa.component.html',
  styleUrl: './dados-empresa.component.css'
})
export class DadosEmpresaComponent {

  form: FormGroup;
  editando = false;
  funcionarioId: string;
  formSenha: FormGroup;
  empresaId: string;
  constructor(
    private fb: FormBuilder,
    private funcionarioService: FuncionarioService,
    private authService: AuthService,
    private router: Router,
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      descricao: ['', Validators.required]
    });

    this.toggleFormState();

    const id = this.authService.obterUsuarioId();
    if (id) {
      this.funcionarioId = id;
      this.carregarFuncionario();
    } else {
      console.error('ID do candidato não encontrado no token.');
    }
  }

  /** Carrega dados do candidato logado */
  carregarFuncionario(): void {
    this.funcionarioService.getFuncionarioById(this.funcionarioId).subscribe({
      next: (funcionario) => {
        this.form.patchValue({
          nome: funcionario.nome,
          email: funcionario.email,
          telefone: funcionario.telefone,
        });
        this.empresaId = funcionario.empresaId!;
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


 atualizarDados(): void {
  if (this.form.invalid) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  const dadosEmpresa: any = {
    empresaId: this.empresaId,  
    nomeNovo: this.form.value.nome,
    descricaoNova: this.form.value.descricao,
    telefoneNovo: this.form.value.telefone
  };

  this.empresaService.solicitarAlteracaoEmpresa(dadosEmpresa, this.funcionarioId)
    .subscribe({
      next: () => {
        alert('Solicitação enviada com sucesso! Aguarde aprovação da empresa.');
        this.editando = false;
        this.toggleFormState();
      },
      error: (err) => {
        console.error('Erro ao enviar solicitação de alteração de dados da empresa:', err);
        alert('Erro ao enviar solicitação.');
      }
    });
}


}