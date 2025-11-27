import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Empresa } from 'src/app/login/models/empresa';
import { EmpresaService } from 'src/app/login/services/empresa.service';

@Component({
  selector: 'app-detalhes-empresa',

  templateUrl: './detalhes-empresa.component.html',
  styleUrl: './detalhes-empresa.component.css'
})
export class DetalhesEmpresaComponent {

  empresa?: Empresa;
  carregando = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private dialogRef: MatDialogRef<DetalhesEmpresaComponent>,
    private empresaService: EmpresaService
  ) {}

  ngOnInit(): void {
    this.empresaService.getEmpresaById(this.data.id).subscribe({
      next: (empresa) => {
        this.empresa = empresa;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      }
    });
  }

  fechar() {
    this.dialogRef.close();
  }

}

