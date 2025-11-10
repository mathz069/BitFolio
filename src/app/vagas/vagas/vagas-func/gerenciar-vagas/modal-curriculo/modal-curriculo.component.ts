import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CandidatoVagaDTO } from 'src/app/shared/models/vagas';

interface ModalData {
  candidato: CandidatoVagaDTO;
}

@Component({
  selector: 'app-modal-curriculo',
  templateUrl: './modal-curriculo.component.html',
  styleUrl: './modal-curriculo.component.css'
})
export class ModalCurriculoComponent {
candidatoVaga: CandidatoVagaDTO;
  
  tecnologiasList: string[] = [];
  idiomasList: string[] = [];
  certificacoesList: string[] = [];
  competenciasList: string[] = [];
  
  constructor(
    public dialogRef: MatDialogRef<ModalCurriculoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) { 
    this.candidatoVaga = this.data.candidato;
  }

  ngOnInit(): void {
    console.log('Dados recebidos no modal de curriculo:', this.candidatoVaga);
    const candidato = this.candidatoVaga?.candidato;
    console.log('Candidato dentro do modal de curriculo:', candidato);
    if (candidato?.curriculo) {
      const curriculo = candidato.curriculo;
      const splitAndTrim = (text: string): string[] => {
        return text.split(',').map(t => t.trim()).filter(t => t.length > 0);
      };

      this.tecnologiasList = splitAndTrim(curriculo.tecnologias);
      this.idiomasList = splitAndTrim(curriculo.idiomas);
      this.certificacoesList = splitAndTrim(curriculo.certificacoes);
      this.competenciasList = splitAndTrim(curriculo.competenciasTecnicas);
    }
  }
  formatarTelefone(telefone: string): string {
    if (!telefone) return '';
    let valor = telefone.replace(/\D/g, '');
    if (valor.length === 11) {
      return `(${valor.substring(0, 2)}) ${valor.substring(2, 7)}-${valor.substring(7, 11)}`;
    } else if (valor.length === 10) {
      return `(${valor.substring(0, 2)}) ${valor.substring(2, 6)}-${valor.substring(6, 10)}`;
    }
    return telefone;
  }

  fecharModalPerfil(): void {
    this.dialogRef.close();
  }
}
