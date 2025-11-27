import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-termos-uso',
  standalone: true,
  imports: [],
  templateUrl: './termos-uso.component.html',
  styleUrl: './termos-uso.component.css'
})
export class TermosUsoComponent {
  backgroundColor: string = '#044894';
  tipoUsuario: 'candidato' | 'funcionario' | 'administrador' = 'candidato';

 constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TermosUsoComponent>
  ) {}

   ngOnInit(): void {
    const userType = localStorage.getItem('userType') || 'candidato';

    if (['candidato', 'funcionario', 'administrador'].includes(userType)) {
      this.tipoUsuario = userType as 'candidato' | 'funcionario' | 'administrador';

      switch (userType) {
    case 'candidato':
      this.backgroundColor = '#044894';
      break;
    case 'funcionario':
      this.backgroundColor = '#940445';
      break;
    case 'administrador':
      this.backgroundColor = '#940404';
      break;
  
  }

  document.documentElement.style.setProperty('--nav-bg-color', this.backgroundColor);
    }
  }

  irParaMinhaConta() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
