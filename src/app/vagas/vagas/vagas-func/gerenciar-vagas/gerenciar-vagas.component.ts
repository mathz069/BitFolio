import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, forkJoin, of } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Pager } from 'src/app/shared/models/pager';
import { VagaDetalheDTO, CandidatoVagaDTO, CandidatoStatusCount, VagaDTO, Vaga } from 'src/app/shared/models/vagas';
import { CandidatoService } from 'src/app/shared/services/candidato.service';
import { VagaService } from 'src/app/shared/services/vagas.service';
import { ModalVagasComponent } from '../../../modal-vagas/modal-vagas.component';
import { EmpresaService } from 'src/app/login/services/empresa.service';
import { ModalStatusComponent } from './modal-status/modal-status.component';
import { ModalCurriculoComponent } from './modal-curriculo/modal-curriculo.component';
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-gerenciar-vagas',
  templateUrl: './gerenciar-vagas.component.html',
  styleUrl: './gerenciar-vagas.component.css'
})
export class GerenciarVagaComponent implements OnInit, OnDestroy {
  vagaId: string | null = null;
  vaga: Vaga | null = null;
  candidatos: CandidatoVagaDTO[] = [];
  pager: Pager = new Pager();
  page: number = 1;
  take: number = 10;
  filtroStatus: number | null = null;
  searchCandidato: string = '';
  candidatoStatusCounts: CandidatoStatusCount = {
    total: 0,
    emAnalise: 0,
    revisado: 0,
    entrevista: 0,
    aprovados: 0,
    rejeitados: 0 
  };
  search = '';
  private destroy$ = new Subject<void>();
  candidatosMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vagaService: VagaService,
    private candidatoService: CandidatoService,
    private dialog: MatDialog,
    private vagasService: VagaService,
    private empresaService: EmpresaService
  ) {}

  ngOnInit(): void {
  this.route.paramMap
    .pipe(
      takeUntil(this.destroy$),
      map(params => params.get('id'))
    )
    .subscribe(vagaId => {
      if (!vagaId) {
        this.router.navigate(['/vagas-func']);
        return;
      }
      this.vagaId = vagaId;
      this.carregarDadosDaVaga();
    });
}

  getStatusClass(status: number): string {
  switch (status) {
    case 0: return 'status-analise';
    case 1: return 'status-analise';
    case 2: return 'status-entrevista';
    case 3: return 'status-aprovado';
    case 4: return 'status-rejeitado';
    default: return '';
  }
}

getStatusLabel(status: number): string {
  switch (status) {
    case 0: return 'Em Análise';
    case 1: return 'Currículo Revisado';
    case 2: return 'Pré-Selecionado';
    case 3: return 'Aprovado';
    case 4: return 'Não Selecionado';
    default: return 'Desconhecido';
  }
}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  buscarCandidatosDaVaga(
  page: number = this.page,
  take: number = this.take,
  status?: number,
  search?: string
): void {
  if (!this.vagaId) return;

  this.page = page;
  this.take = take;
  this.filtroStatus = status === undefined ? this.filtroStatus : status;
  this.searchCandidato = search === undefined ? this.searchCandidato : search;

  this.vagasService
  .getCandidatosDaVaga(this.vagaId, this.page, this.take, this.filtroStatus, this.searchCandidato)
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (response) => {

      const data = response.body || [];

      if (data.length === 0) {
        this.candidatos = [];
        this.candidatosMessage = 'Nenhum candidato encontrado para esta vaga.';
      } else {
        this.candidatosMessage = '';
        this.candidatos = data;

        const totalItems = Number(response.headers.get('qtd'));
        const range = response.headers.get('range') || '';
        this.createPagination(totalItems, this.page, this.take, range);

        this.candidatoStatusCounts = {
          total: Number(response.headers.get('total') || 0),
          emAnalise: Number(response.headers.get('emAnalise') || 0),
          revisado: Number(response.headers.get('revisado') || 0),
          entrevista: Number(response.headers.get('entrevista') || 0),
          aprovados: Number(response.headers.get('aprovados') || 0),
          rejeitados: Number(response.headers.get('rejeitados') || 0)
        };
      }
    },

    error: (err: HttpErrorResponse) => {
      console.error('Erro ao buscar candidatos da vaga:', err);
      this.candidatos = [];
      this.candidatosMessage = 'Nenhum candidato encontrado para esta vaga.';
    }
  });

}


  createPagination(totalItems: number, currentPage: number = 1, take: number = 10, range: string = ''): void {
    const totalPages = Math.ceil(totalItems / take);
    this.pager = {
      totalItems,
      currentPage,
      pageSize: take,
      totalPages,
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
      range
    } as Pager;
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  getStatusBadgeClass(status: number): string {
    switch (status) {
      case 0: return 'status-analise'; // CVRecebido - Em Análise
      case 1: return 'status-analise'; // CVRevisado - Em Análise (ou crie uma classe específica se houver visual diferente)
      case 2: return 'status-entrevista'; // CVPreSelecionado - Entrevista Agendada (ou crie uma classe para pré-selecionado)
      case 3: return 'status-aprovado'; // CVSelecionado - Aprovado
      case 4: return 'status-rejeitado'; // CVNaoSelecionado - Não Selecionado
      default: return '';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Em Análise';
      case 1: return 'Currículo Revisado';
      case 2: return 'Pré-Selecionado';
      case 3: return 'Aprovado';
      case 4: return 'Não Selecionado';
      default: return 'Desconhecido';
    }
  }
  carregarDadosDaVaga(): void {
  if (!this.vagaId) return;

  this.vagaService.getVagaById(this.vagaId)
    .pipe(
      takeUntil(this.destroy$),
      switchMap(vaga => {
        this.vaga = {
          ...vaga,
          dataAbertura: vaga.dataAbertura ? new Date(vaga.dataAbertura) : null,
          dataFechamento: vaga.dataFechamento ? new Date(vaga.dataFechamento) : null,
          requisitos: Array.isArray(vaga.requisitos)
            ? vaga.requisitos.join(', ')
            : vaga.requisitos || '',
          tecnologias: Array.isArray(vaga.tecnologias)
            ? vaga.tecnologias.join(', ')
            : vaga.tecnologias || '',
        };

        if (!vaga.empresaId) {
          return of(null);
        }

        return this.empresaService.getEmpresaById(vaga.empresaId).pipe(
          tap(empresa => {
            if (this.vaga) {
              this.vaga.Empresa = empresa;
            }
          })
        );
      })
    )
    .subscribe({
      next: () => {
        this.buscarCandidatosDaVaga();
      },
      error: (err) => {
        console.error('Erro ao carregar a vaga/empresa:', err);
      }
    });
}
  abrirModalStatus(candidato: CandidatoVagaDTO): void {
    const config = new MatDialogConfig();
        config.width = '1000px';
        config.maxWidth = '87%';
        config.disableClose = true;
        config.autoFocus = true;
        config.panelClass = 'custom-2fa-panel';
        config.backdropClass = 'custom-2fa-backdrop';
    config.data = {
    candidatoVaga: candidato, 
    vagaId: this.vagaId
  }
    const dialogRef = this.dialog.open(ModalStatusComponent, config);

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.buscarCandidatosDaVaga();
      }
    });
  }

  abrirModalCurriculo(candidato: CandidatoVagaDTO): void {
    const config = new MatDialogConfig();
    config.width = '1000px';
    config.maxWidth = '87%';
    config.disableClose = true;
    config.autoFocus = true;
    config.panelClass = 'custom-2fa-panel';
    config.backdropClass = 'custom-2fa-backdrop';
    config.data = { candidato }; 
    console.log('Candidato para ver curriculo:', candidato);

    this.dialog.open(ModalCurriculoComponent, config);
  }

  voltar(): void {
  window.history.back();
  }

  abrirModalEdicao(): void {
    if (!this.vaga) return;

    const config = new MatDialogConfig();
    config.width = '1000px';
    config.maxWidth = '87%';
    config.disableClose = true;
    config.autoFocus = true;
    config.panelClass = 'custom-2fa-panel';
    config.backdropClass = 'custom-2fa-backdrop';
    config.data = { vaga: this.vaga }; // Passa a vaga para o modal de edição

    const dialogRef = this.dialog.open(ModalVagasComponent, config);

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((vagaAtualizada: boolean) => {
      if (vagaAtualizada) {
       this.carregarDadosDaVaga(); // Recarrega os detalhes da vaga se editada
      }
    });
  }

  get totalCandidatos(): number {
  return this.candidatoStatusCounts.total;
}
 onStatusChange(status: string | number): void {
  if (status === '' || status === null) {
    this.filtroStatus = undefined;
  } else {
    this.filtroStatus = Number(status);
  }

  this.buscarCandidatosDaVaga(1, this.take);
}

onSearch(): void {
  this.searchCandidato = this.search;
  this.buscarCandidatosDaVaga(1, this.take);
}

exportarParaExcel(): void {
  const dadosParaExportar: any[] = [];

  const tituloVaga = `${this.vaga?.titulo || 'Nome da Vaga'} - ${new Date().toLocaleDateString()}`;
  dadosParaExportar.push([tituloVaga]);

  dadosParaExportar.push([]);

  const headers = [
    'Nome Candidato',
    'Telefone',
    'Email',
    'Experiência Profissional',
    'Tecnologias',
    'Competências Técnicas',
    'Idiomas',
    'Certificações',
    'Status Atual'
  ];
  dadosParaExportar.push(headers);

  // Dados dos candidatos
  this.candidatos.forEach(candidato => {

    const formatarLista = (valor: string | string[]) => {
      if (!valor) return '';
      if (Array.isArray(valor)) return valor.join('\n');
      return valor.split(',').map(v => v.trim()).join('\n');
    };

    const candidatoData = [
      candidato.candidato.nome,
      this.formatarTelefone(candidato.candidato.telefone),
      candidato.candidato.email,
      candidato.candidato.curriculo.experiencias || '',
      formatarLista(candidato.candidato.curriculo.tecnologias),
      candidato.candidato.curriculo.competenciasTecnicas || '',
      formatarLista(candidato.candidato.curriculo.idiomas),
      formatarLista(candidato.candidato.curriculo.certificacoes),
      this.getStatusLabel(candidato.historico.status)
    ];

    dadosParaExportar.push(candidatoData);
  });

  // Totais
  dadosParaExportar.push([]);
  dadosParaExportar.push(['', '', '', '', 'Total Candidatos', this.candidatoStatusCounts.total]);
  dadosParaExportar.push(['', '', '', '', 'Total Aprovados', this.candidatoStatusCounts.aprovados]);
  dadosParaExportar.push(['', '', '', '', 'Total Rejeitados', this.candidatoStatusCounts.rejeitados]);
  dadosParaExportar.push(['', '', '', '', 'Total Em Análise', this.candidatoStatusCounts.emAnalise]);
  dadosParaExportar.push(['', '', '', '', 'Total Entrevistas', this.candidatoStatusCounts.entrevista]);

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dadosParaExportar);

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } } 
  ];

  ws['A1'].s = {
    alignment: { horizontal: 'center', vertical: 'center' },
    font: { bold: true, sz: 14 }
  };

  const colunasQuebrarLinha = [4, 6, 7]; 
  const primeiraLinhaDados = 3; 

  for (let R = primeiraLinhaDados; R < dadosParaExportar.length; R++) {
    colunasQuebrarLinha.forEach(C => {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          alignment: { wrapText: true }
        };
      }
    });
  }

  // Criar workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Relatório Candidatos');

  // Salvar
  const nomeArquivo = `Relatorio_Candidatos_${this.vaga?.titulo || 'Vaga'}_${new Date().toLocaleDateString()}.xlsx`;
  XLSX.writeFile(wb, nomeArquivo);
}


}