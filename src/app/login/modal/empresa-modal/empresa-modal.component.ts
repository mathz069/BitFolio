import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa';
import { MatDialogRef } from '@angular/material/dialog';
import { EnderecoService } from 'src/app/shared/services/endereco.service';

@Component({
  selector: 'app-empresa-modal',
  templateUrl: './empresa-modal.component.html',
  styleUrls: ['./empresa-modal.component.css']
})
export class EmpresaModalComponent implements OnInit {
step = 1;

  empresaForm: FormGroup;
  enderecoForm: FormGroup;

  isSubmitting = false;
  @Output() empresaCriada = new EventEmitter<Empresa>();
  @Output() closeModal = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private empresaService: EmpresaService,
        private enderecoService: EnderecoService,
        private dialogRef: MatDialogRef<EmpresaModalComponent>,
  ) {
    this.empresaForm = this.fb.group({
      nome: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.minLength(14)]], 
      razaoSocial: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      descricao: ['']
    });

    this.enderecoForm = this.fb.group({
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      cep: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  ngOnInit(): void {
  }

setBorder(controlName: string): string {
  const currentForm = this.step === 1 ? this.empresaForm : this.enderecoForm;
  const control = currentForm.get(controlName);
  return control && control.invalid && control.touched ? '1px solid red' : '1px solid #ccc';
}

 nextStep() {
  if (this.empresaForm.valid) {
    this.step = 2;

    setTimeout(() => {
      const container = document.querySelector('.bodydiv');
      container?.scrollTo({ top: 0, behavior: 'instant' });
    });
  } else {
    this.empresaForm.markAllAsTouched();
  }
}


  previousStep() {
    this.step = 1;
  }

 submit() {
  if (this.enderecoForm.invalid) {
    this.enderecoForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;

  this.empresaService.createEndereco(this.enderecoForm.value).subscribe({
    next: (enderecoResponse) => {
      const empresaData = {
        ...this.empresaForm.value,
        enderecoId: enderecoResponse.enderecoId
      };

      this.empresaService.createEmpresa(empresaData).subscribe({
        next: (empresaResponse) => {
          this.isSubmitting = false;

          this.empresaCriada.emit(empresaResponse);

          this.fechar();
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error('Erro ao criar empresa:', err);
        }
      });
    },
    error: (err) => {
      this.isSubmitting = false;
      console.error('Erro ao criar endereço:', err);
    }
  });
}


buscarCep(): void {
  const cep = this.enderecoForm.value.cep?.replace(/\D/g, '');
  if (cep && cep.length === 8) {
    this.enderecoService.buscarCep(cep).subscribe({
      next: (dados) => {

        const latitudeValue = dados.lat ? parseFloat(dados.lat) : null;
        const longitudeValue = dados.lng ? parseFloat(dados.lng) : null;

        this.enderecoForm.patchValue({
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

 fechar(): void {
    this.dialogRef.close(false);
  }

}