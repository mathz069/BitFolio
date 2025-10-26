import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-endereco-modal',
  templateUrl: './endereco-modal.component.html',
  styleUrl: './endereco-modal.component.css'
})
export class EnderecoModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EnderecoModalComponent>
  ) {}

  irParaMinhaConta() {
    // Fecha o modal passando true
    this.dialogRef.close(true);
  }

  cancelar() {
    // Fecha o modal sem valor
    this.dialogRef.close(false);
  }
}
