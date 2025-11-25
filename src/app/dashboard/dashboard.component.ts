import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/services/auth.service';
import { CandidatoService } from '../shared/services/candidato.service';
import { VagaService } from '../shared/services/vagas.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  candidatoId: string = '';
  candidato: any;

  candidaturas: any[] = [];
  logs: any[] = [];

  notificacoes = 0;

  totais = {
    total: 0,
    emAnalise: 0,
    entrevista: 0,
    aprovado: 0,
    naoSelecionado: 0
  };

  constructor(
    private candidatoService: CandidatoService,
    private candidaturaService: VagaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const usuarioId = this.authService.obterUsuarioId();

    if (!usuarioId) {
      console.error("Usuário não autenticado.");
      return;
    }

    this.candidatoId = usuarioId.toString();

    this.carregarCandidato();
    this.buscarHistorico();
    this.buscarLogs();
  }

  carregarCandidato() {
    this.candidatoService.getCandidatoById(this.candidatoId).subscribe({
      next: res => this.candidato = res,
      error: err => console.error("Erro ao carregar candidato", err)
    });
  }

  buscarHistorico(): void {
    this.candidaturaService.getHistoricoCandidaturas(this.candidatoId).subscribe({
      next: (res: any[]) => {
        this.candidaturas = res;
        this.calcularTotais();
      },
      error: (err) => {
        console.error('Erro ao buscar histórico:', err);
      }
    });
  }

  calcularTotais() {
    this.totais.total = this.candidaturas.length;

    this.totais.emAnalise = this.candidaturas.filter(c => c.status === 0).length;
    this.totais.entrevista = this.candidaturas.filter(c => c.status === 2).length;
    this.totais.aprovado = this.candidaturas.filter(c => c.status === 3).length;
    this.totais.naoSelecionado = this.candidaturas.filter(c => c.status === 4).length;
  }

  buscarLogs() {
    this.candidatoService.getLogsCandidato(this.candidatoId, 1, 10).subscribe({
      next: (res: any[]) => {
        this.logs = res
    .sort((a, b) => new Date(b.dtAcao).getTime() - new Date(a.dtAcao).getTime())
    .slice(0, 5);
      },
      error: err => console.error("Erro ao carregar logs", err)
    });
  }

  formatarData(data: string): string {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
  }

}