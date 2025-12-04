import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dois-fatores-modal',
  templateUrl: './dois-fatores-modal.component.html',
  styleUrls: ['./dois-fatores-modal.component.css']
})
export class DoisFatoresModalComponent {
  form: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DoisFatoresModalComponent>
  ) {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  cancelar() {
  this.dialogRef.close(); // Fecha o modal sem retornar nenhum valor
}

confirmar() {
  if (this.form.invalid) return;

  const codigo = this.form.value.codigo;
  this.dialogRef.close(codigo); // Fecha o modal retornando o código
}
}
