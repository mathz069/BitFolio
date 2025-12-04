import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/login/services/auth.service';
import { ToggleFavorito } from 'src/app/shared/models/toogle-favorito';
import { HistoricoCandidatura } from 'src/app/shared/models/vagas';
import { CandidatoService } from 'src/app/shared/services/candidato.service';
import { VagaService } from 'src/app/shared/services/vagas.service';

@Component({
  selector: 'app-minhas-vagas',
  templateUrl: './minhas-vagas.component.html',
  styleUrls: ['./minhas-vagas.component.css']
})

export class MinhasVagasComponent implements OnInit {
  candidaturas: HistoricoCandidatura[] = [];
  candidatoId: string = '';
  candidato: any;

  constructor(
    private authService: AuthService,
    private candidatoService: CandidatoService,
    private candidaturaService: VagaService  
  ) {}

  ngOnInit(): void {
    const usuarioId = this.authService.obterUsuarioId();
    if (usuarioId) {
      this.candidatoId = usuarioId.toString();
      this.candidatoService.getCandidatoById(this.candidatoId).subscribe({
        next: (candidato: any) => {
          this.candidato = candidato;
          this.buscarHistorico();
        },
        error: (err) => {
          console.error('Erro ao buscar candidato:', err);
          this.buscarHistorico(); 
        }
      });
    } else {
      console.error('Usuário não autenticado ou token inválido.');
    }
  }
  getEmpresaNome(c: any): string {
  return  c?.vaga?.empresa?.nome
    || 'Empresa não informada';
}

getStatusLabel(status: number): string {
  switch (status) {
    case 0: return 'Em Análise';
    case 1: return 'Curriculo Revisado';
    case 2: return 'Entrevista';
    case 3: return 'Aprovado';
    case 4: return 'Não Selecionado';
    default: return 'Desconhecido';
  }
}
  buscarHistorico(): void {
    this.candidaturaService.getHistoricoCandidaturas(this.candidatoId).subscribe({
      next: (res: HistoricoCandidatura[]) => {
        this.candidaturas = res;
        console.log('Histórico de candidaturas:', this.candidaturas);
        
      },
      error: (err) => {
        console.error('Erro ao buscar histórico de candidaturas:', err);
      }
    });
  }
}