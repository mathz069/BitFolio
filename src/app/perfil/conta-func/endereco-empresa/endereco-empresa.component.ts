import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/services/auth.service';
import { EmpresaService } from 'src/app/login/services/empresa.service';
import { Candidato } from 'src/app/models/candidato';
import { Funcionario } from 'src/app/models/funcionario';
import { CandidatoService } from 'src/app/shared/services/candidato.service';
import { EnderecoService } from 'src/app/shared/services/endereco.service';
import { FuncionarioService } from 'src/app/shared/services/funcionario.service';

@Component({
  selector: 'app-endereco-empresa',
  templateUrl: './endereco-empresa.component.html',
  styleUrl: './endereco-empresa.component.css'
})
export class EnderecoEmpresaComponent {
form: FormGroup;
  editando = false;
  enderecoId: string | null = null;
  funcionarioId: string | null = null;
  funcionario: Funcionario | null = null;
  empresaId: string | null = null;
  constructor(
    private fb: FormBuilder,
    private enderecoService: EnderecoService,
    private authService: AuthService,
    private candidatoService: CandidatoService,
    private empresaService: EmpresaService,
    private funcionarioService: FuncionarioService
  ) {
    this.form = this.fb.group({
  cep: ['', Validators.required],
  estado: ['', Validators.required],
  cidade: ['', Validators.required],
  rua: ['', Validators.required],
  numero: ['', Validators.required],
  bairro: ['', Validators.required],
  complemento: [''],
  latitude: [null], 
  longitude: [null] 
});
  }

  ngOnInit(): void {
    this.toggleFormState();
    const id = this.authService.obterUsuarioId();
    if (id) {
      this.funcionarioId = id;
      
     this.funcionarioService.getFuncionarioById(this.funcionarioId).subscribe({
      next: (funcionario: any) => {
        this.funcionario = funcionario;
        const temEmpresa = !!funcionario.empresaId;
        console.log('Funcionario carregado:', funcionario);
        if (temEmpresa) {
          this.empresaId = funcionario.empresaId;
          this.carregarEmpresa();
         // this.carregarEndereco();
        }
      },
      error: (err) => {
        console.error('Erro ao buscar candidato:', err);
      }
    });
  }
}
  carregarEmpresa(): void {
    if (!this.empresaId) return;
    this.empresaService.getEmpresaById(this.empresaId).subscribe({
      next: (empresa) => {
        this.enderecoId = empresa.enderecoId;
        this.carregarEndereco();
      }
      ,
      error: (err) => console.error('Erro ao buscar empresa:', err)
    });
  }
  carregarEndereco(): void {
    if (!this.enderecoId) return;
    this.enderecoService.getEnderecoById(this.enderecoId).subscribe({
      next: (endereco) => {
        this.form.patchValue(endereco);
        
      },
      error: (err) => console.error('Erro ao buscar endereço:', err)
    });
  }

    excluir(): void {
    if (!this.enderecoId) return;

    if (confirm('Tem certeza que deseja excluir seu currículo?')) {
      this.enderecoService.deleteEndereco(this.enderecoId).subscribe({
        next: () => {
          alert('Currículo excluído com sucesso!');
          this.form.reset();
          this.enderecoId = null;
        },
        error: (err) => console.error('Erro ao excluir currículo:', err)
      });
    }
  }


  toggleEdicao(): void {
    this.editando = !this.editando;
    this.toggleFormState();
  }

  atualizarEndereco(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  const enderecoAtualizado = {
    enderecoId: this.enderecoId,
    empresaId: this.empresaId,
    ...this.form.value
  };

  this.enderecoService.updateEndereco(enderecoAtualizado).subscribe({
    next: () => {
      alert('Endereço atualizado com sucesso!');
      this.editando = false;
      this.toggleFormState();
    },
    error: (err) => {
      console.error('Erro ao atualizar endereço:', err);
      alert('Erro ao atualizar endereço.');
    }
  });
}


  toggleFormState(): void {
    if (this.editando) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

buscarCep(): void {
  const cep = this.form.value.cep?.replace(/\D/g, '');
  if (cep && cep.length === 8) {
    this.enderecoService.buscarCep(cep).subscribe({
      next: (dados) => {
        console.log('📦 Resposta da API AwesomeAPI:', dados);

        // Faz o parse das coordenadas (strings -> número)
        const latitudeValue = dados.lat ? parseFloat(dados.lat) : null;
        const longitudeValue = dados.lng ? parseFloat(dados.lng) : null;

        // Atualiza o formulário com os campos certos
        this.form.patchValue({
          estado: dados.state || '',
          cidade: dados.city || '',
          bairro: dados.district || '',
          rua: dados.address || dados.address_name || '',
          numero: '',
          complemento: '',
          latitude: latitudeValue,
          longitude: longitudeValue
        });

        console.log('Form preenchido com sucesso:', this.form.value);
      },
      error: (err) => {
        console.error('Erro ao buscar CEP:', err);
        alert('CEP não encontrado.');
      }
    });
  } else {
    alert('Digite um CEP válido com 8 números.');
  }
}
}