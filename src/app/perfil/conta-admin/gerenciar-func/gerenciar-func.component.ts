import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/login/services/auth.service';
import { Administrador } from 'src/app/models/administrador';
import { FuncionarioDTO } from 'src/app/shared/models/curriculo';
import { Pager } from 'src/app/shared/models/pager';
import { AdminService } from 'src/app/shared/services/admin.service';
import { FuncionarioService } from 'src/app/shared/services/funcionario.service';
import { EnderecoModalComponent } from 'src/app/vagas/vagas/endereco-modal/endereco-modal.component';

@Component({
  selector: 'app-gerenciar-func',
  templateUrl: './gerenciar-func.component.html',
  styleUrl: './gerenciar-func.component.css'
})
export class GerenciarFuncComponent {
 adminId!: string;
  administrador?: Administrador;

  funcionarios: FuncionarioDTO[] = [];
  page = 1;
  take = 10;
  pager: Pager = new Pager();

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private funcService: FuncionarioService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.authService.obterUsuarioId();

    if (id) {
      this.adminId = id;
      this.carregarAdmin();
      this.buscarFuncionarios();
    }
  }

  carregarAdmin(): void {
    this.adminService.getAdministradorById(this.adminId).subscribe({
      next: (admin) => this.administrador = admin,
      error: (err) => console.error('Erro ao buscar administrador:', err)
    });
  }

  buscarFuncionarios(filtroPage?: number, takePage?: number): void {
    const page = filtroPage || this.page;
    const take = takePage || this.take;

    this.funcService.getFuncionarios(page, take).subscribe({
      next: (res: any) => {
        this.funcionarios = res.body || [];

        const totalItems = Number(res.headers.get('qtd') || this.funcionarios.length);
        const range = res.headers.get('range') || '';
        this.createPagination(totalItems, page, take, range);
      },
      error: (err) => console.error('Erro ao buscar funcionários:', err)
    });
  }

  createPagination(totalItems: number, currentPage: number = 1, take: number = 10, range: string = ''): void {
    const totalPages = Math.ceil(totalItems / take) || 1;

    this.pager = {
      totalItems,
      currentPage,
      pageSize: take,
      totalPages,
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
      range
    } as Pager;
  }

  // ------------- EXCLUIR FUNCIONÁRIO -------------
  excluirFuncionario(func: FuncionarioDTO): void {
    const config = new MatDialogConfig();
    config.width = '600px';
    config.maxWidth = '87%';
    config.disableClose = true;
    config.autoFocus = true;
    config.panelClass = 'custom-2fa-panel';
    config.backdropClass = 'custom-2fa-backdrop';

    config.data = {
      mensagem: 'Deseja excluir este funcionário? Esta ação não pode ser desfeita.',
      botaoTexto: 'Excluir'
    };

    const dialogRef = this.dialog.open(EnderecoModalComponent, config);

    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        this.funcService.deleteFuncionario(func.recrutadorId).subscribe({
          next: () => this.buscarFuncionarios(this.page, this.take),
          error: (err) => console.error('Erro ao excluir funcionário:', err)
        });
      }
    });
  }

  // ====== ANONIMIZAÇÕES ======

  anonimizarNome(nome: string | null | undefined): string {
    if (!nome) return '';

    const partes = nome.trim().split(/\s+/).filter(p => p.length > 0);
    if (partes.length === 0) return '';

    const primeiro = partes[0];
    const segundo = partes[1] || '';

    const prefixo = primeiro.slice(0, 3);

    if (segundo) {
      return `${prefixo}*** ${segundo.charAt(0)}.`;
    }

    return `${prefixo}***`;
  }

  anonimizarEmail(email: string): string {
    if (!email) return '';
    const [local, dominio] = email.split('@');
    if (!local) return email;
    const prefix = local.slice(0, 2);
    return `${prefix}***@${dominio}`;
  }
}