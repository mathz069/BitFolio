import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa';

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

  constructor(private fb: FormBuilder, private empresaService: EmpresaService) {
    this.empresaForm = this.fb.group({
      nome: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.minLength(14)]], // ajuste validação
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
    throw new Error('Method not implemented.');
  }

setBorder(controlName: string): string {
  const currentForm = this.step === 1 ? this.empresaForm : this.enderecoForm;
  const control = currentForm.get(controlName);
  return control && control.invalid && control.touched ? '1px solid red' : '1px solid #ccc';
}

  nextStep() {
    if (this.empresaForm.valid) {
      this.step = 2;
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
        enderecoId: enderecoResponse.id
      };

      this.empresaService.createEmpresa(empresaData).subscribe({
        next: (empresaResponse) => {
          this.isSubmitting = false;

          this.empresaCriada.emit(empresaResponse);

          this.close();
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
  close() {
  }
}