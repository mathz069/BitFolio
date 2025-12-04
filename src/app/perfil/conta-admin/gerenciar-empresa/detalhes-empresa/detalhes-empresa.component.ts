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

  formatarCnpj(cnpj: string): string {
    if (!cnpj) return '';
    // Remove tudo que não for número
    cnpj = cnpj.replace(/\D/g, '');
    // Aplica a máscara
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
  
  fechar() {
    this.dialogRef.close();
  }

}

