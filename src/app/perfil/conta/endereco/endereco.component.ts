import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/login/services/auth.service';
import { Candidato } from 'src/app/models/candidato';
import { CandidatoService } from 'src/app/shared/services/candidato.service';
import { EnderecoService } from 'src/app/shared/services/endereco.service';


@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.component.html',
  styleUrl: './endereco.component.css'
})
export class EnderecoComponent {
 form: FormGroup;
  editando = false;
  enderecoId: string | null = null;
  candidatoId: string | null = null;
  candidato: Candidato | null = null;
  constructor(
    private fb: FormBuilder,
    private enderecoService: EnderecoService,
    private authService: AuthService,
    private candidatoService: CandidatoService
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
      this.candidatoId = id;
      
     this.candidatoService.getCandidatoById(this.candidatoId).subscribe({
      next: (candidato: any) => {
        this.candidato = candidato;
        const temEndereco = !!candidato.enderecoId;

        if (temEndereco) {
          this.enderecoId = candidato.enderecoId;
          this.carregarEndereco();
        }
      },
      error: (err) => {
        console.error('Erro ao buscar candidato:', err);
      }
    });
  }
}

  carregarEndereco(): void {
    if (!this.candidatoId) return;
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
  let enderecoAtualizado = {}
  if (this.enderecoId != null) {
   enderecoAtualizado = {
    enderecoId: this.enderecoId,
    candidatoId: this.candidatoId,
    ...this.form.value
  };
}
  enderecoAtualizado = {
    candidatoId: this.candidatoId,
    ...this.form.value
  };

  this.enderecoService.updateEndereco(enderecoAtualizado, this.candidatoId).subscribe({
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

        const latitudeValue = dados.lat ? parseFloat(dados.lat) : null;
        const longitudeValue = dados.lng ? parseFloat(dados.lng) : null;

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