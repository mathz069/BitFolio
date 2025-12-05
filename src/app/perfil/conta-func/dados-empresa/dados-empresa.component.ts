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
  empresaId: string;

  constructor(
    private fb: FormBuilder,
    private funcionarioService: FuncionarioService,
    private authService: AuthService,
    private router: Router,
    private empresaService: EmpresaService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      razaoSocial: ['', Validators.required],
      telefone: ['', Validators.required],
      descricao: ['', Validators.required]
    });

    this.toggleFormState();

    const id = this.authService.obterUsuarioId();
    if (id) {
      this.funcionarioId = id;
      this.carregarFuncionario();
    } else {
      console.error('ID do funcionário não encontrado no token.');
    }
  }

  /** Carrega dados do funcionário e depois da empresa */
  carregarFuncionario(): void {
    this.funcionarioService.getFuncionarioById(this.funcionarioId).subscribe({
      next: (funcionario) => {
        this.empresaId = funcionario.empresaId!;
        this.carregarEmpresa(); // 🔥 Agora carrega a empresa corretamente.
      },
      error: (err) => console.error('Erro ao buscar funcionário:', err)
    });
  }

  /** Carrega os dados da empresa no formulário */
  carregarEmpresa(): void {
    this.empresaService.getEmpresaById(this.empresaId).subscribe({
      next: (empresa) => {
        this.form.patchValue({
          nome: empresa.nome,
          razaoSocial: empresa.razaoSocial,
          descricao: empresa.descricao
        });
      },
      error: (err) => console.error('Erro ao buscar empresa:', err)
    });
  }

  /** Alterna modo edição */
  toggleEdicao(): void {
    this.editando = !this.editando;
    this.toggleFormState();
  }

  /** Ativa/desativa form */
  private toggleFormState(): void {
    if (this.editando) this.form.enable();
    else this.form.disable();
  }

  /** Envia solicitação de atualização */
  atualizarDados(): void {
    if (this.form.invalid) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const dadosEmpresa = {
      empresaId: this.empresaId,
      nomeNovo: this.form.value.nome,
      razaoSocialNova: this.form.value.razaoSocial,
      descricaoNova: this.form.value.descricao,
      telefoneNovo: this.form.value.telefone
    };

    this.empresaService.solicitarAlteracaoEmpresa(dadosEmpresa, this.funcionarioId)
      .subscribe({
        next: () => {
          alert('Solicitação enviada com sucesso! Aguarde aprovação.');
          this.editando = false;
          this.toggleFormState();
        },
        error: (err) => {
          console.error('Erro ao enviar solicitação:', err);
          alert('Erro ao enviar solicitação.');
        }
      });
  }
}