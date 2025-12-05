import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';
import { FuncionarioDTO } from 'src/app/shared/models/curriculo';
import { Pager } from 'src/app/shared/models/pager';
import { Vaga, VagaDTO } from 'src/app/shared/models/vagas';
import { FuncionarioService } from 'src/app/shared/services/funcionario.service';
import { VagaService } from 'src/app/shared/services/vagas.service';
import { ModalVagasComponent } from '../../modal-vagas/modal-vagas.component';

@Component({
  selector: 'app-vagas-func',
  templateUrl: './vagas-func.component.html',
  styleUrl: './vagas-func.component.css'
})
export class VagasFuncComponent implements OnInit {

  empresaId: string | null = null;
  vagas: VagaDTO[] = [];
  pager: Pager = new Pager();
  page: number = 1;
  take: number = 5;

  constructor(
    private vagaService: VagaService,
    private funcionarioService: FuncionarioService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuarioId = this.authService.obterUsuarioId();
    if (!usuarioId) return;

    // Busca o funcionário para obter o empresaId
    this.funcionarioService.getFuncionarioById(usuarioId.toString())
      .subscribe({
        next: (funcionario: FuncionarioDTO) => {
          if (funcionario.empresaId) {
            this.empresaId = funcionario.empresaId;
            this.buscarVagasPorEmpresa();
          } else {
            console.error('Funcionário não está vinculado a nenhuma empresa.');
          }
        },
        error: (err) => console.error('Erro ao buscar funcionário:', err)
      });
  }

  buscarVagasPorEmpresa(filtroPage?: number, takePage?: number) {
    if (!this.empresaId) return;

    const page = filtroPage || this.page;
    const take = takePage || this.take;

    this.vagaService.getVagasByNegocio(this.empresaId, page, take)
      .subscribe({
        next: (response) => {
          this.vagas = (response.body || []).map(v => ({
            ...v,
            dataAbertura: new Date(v.dataAbertura),
            dataFechamento: new Date(v.dataFechamento),
            requisitos: Array.isArray(v.requisitos)
              ? v.requisitos
              : (v.requisitos as string)?.split(',').map(r => r.trim()) || [],
            tecnologias: Array.isArray(v.tecnologias)
              ? v.tecnologias
              : (v.tecnologias as string)?.split(',').map(t => t.trim()) || []
          }));

          const totalItems = Number(response.headers.get('qtd'));
          const range = response.headers.get('range') || '';
          this.createPagination(totalItems, page, take, range);
        },
        error: (err) => console.error('Erro ao buscar vagas da empresa:', err)
      });
  }

  createPagination(totalItems: number, currentPage: number = 1, take: number = 10, range: string = '') {
    const totalPages = Math.ceil(totalItems / take);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    this.pager = {
      totalItems,
      currentPage,
      pageSize: take,
      totalPages,
      pages,
      range
    } as Pager;
  }

  abrirModal() {
    const config = new MatDialogConfig();
      const titulo = `Cadastrar Vaga`;
        config.width = '1000px';
        config.maxWidth = '87%';
        config.disableClose = true;
        config.autoFocus = true;
        config.panelClass = 'custom-2fa-panel';
        config.backdropClass = 'custom-2fa-backdrop';
        config.data = { titulo };
    const dialogRef = this.dialog.open(ModalVagasComponent, config);

    dialogRef.afterClosed().subscribe((novaVagaCadastrada: boolean) => {
      if (novaVagaCadastrada) {
        this.buscarVagasPorEmpresa();
      }
    });
  }

  editarVaga(vaga: VagaDTO): void {
  const config = new MatDialogConfig();
  const titulo = `Editar Vaga`;
  config.width = '1000px';
  config.maxWidth = '87%';
  config.disableClose = true;
  config.autoFocus = true;
  config.panelClass = 'custom-2fa-panel';
  config.backdropClass = 'custom-2fa-backdrop';
  config.data = { titulo, vaga };

  const dialogRef = this.dialog.open(ModalVagasComponent, config);

  dialogRef.afterClosed().subscribe((vagaAtualizada: boolean) => {
    if (vagaAtualizada) {
      this.buscarVagasPorEmpresa(this.pager.currentPage, this.take);
    }
  });
}

deletarVaga(vaga: VagaDTO): void {
  if (!confirm(`Deseja realmente excluir a vaga "${vaga.titulo}"?`)) return;

  this.vagaService.deleteVaga(vaga.vagaId).subscribe({
    next: () => this.buscarVagasPorEmpresa(this.pager.currentPage, this.take),
    error: (err) => console.error('Erro ao deletar vaga:', err)
  });
}

  redirecionarParaGerenciar(vagaId: string) {
    this.router.navigate([`/gerenciar-vagas/vaga/${vagaId}`]);
  }

  trackByVagaId(index: number, vaga: VagaDTO) {
    return vaga.vagaId;
  }
}