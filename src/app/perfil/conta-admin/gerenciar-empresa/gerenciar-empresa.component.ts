import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Empresa } from 'src/app/login/models/empresa';
import { AuthService } from 'src/app/login/services/auth.service';
import { EmpresaService } from 'src/app/login/services/empresa.service';
import { Administrador } from 'src/app/models/administrador';
import { Pager } from 'src/app/shared/models/pager';
import { AdminService } from 'src/app/shared/services/admin.service';
import { EnderecoModalComponent } from 'src/app/vagas/vagas/endereco-modal/endereco-modal.component';
import { DetalhesEmpresaComponent } from './detalhes-empresa/detalhes-empresa.component';

@Component({
  selector: 'app-gerenciar-empresa',
  templateUrl: './gerenciar-empresa.component.html',
  styleUrl: './gerenciar-empresa.component.css'
})
export class GerenciarEmpresaComponent {
  adminId!: string;
  administrador?: Administrador;

  empresas: Empresa[] = [];
  page = 1;
  take = 10;
  pager: Pager = new Pager();

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private empresaService: EmpresaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.authService.obterUsuarioId();
    if (id) {
      this.adminId = id;
      this.carregarAdmin();
      this.buscarEmpresas();
    } else {
      console.error('ID do administrador não encontrado no token.');
    }
  }

  carregarAdmin(): void {
    this.adminService.getAdministradorById(this.adminId).subscribe({
      next: (admin) => {
        this.administrador = admin;
      },
      error: (err) => console.error('Erro ao buscar administrador:', err)
    });
  }

  buscarEmpresas(filtroPage?: number, takePage?: number): void {
    const page = filtroPage || this.page;
    const take = takePage || this.take;

    this.empresaService.getAllEmpresas(page, take).subscribe({
      next: (empresas) => {
        this.empresas = empresas.body;

       const totalItems = Number(empresas.headers.get('qtd'));
        const range = empresas.headers.get('range') || '';
        this.createPagination(totalItems, this.page, this.take, range);
      },
      error: (err) => console.error('Erro ao buscar empresas:', err)
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

  aprovarEmpresa(id: string): void {
    this.adminService.aprovarEmpresa(id).subscribe({
      next: () => this.buscarEmpresas(this.page, this.take),
      error: (err) => console.error('Erro ao aprovar empresa:', err)
    });
  }

  reprovarEmpresa(empresa: Empresa): void {
      const isAtiva = empresa.ativo === true;
    const config = new MatDialogConfig();
            config.width = '600px';
            config.maxWidth = '87%';
            config.disableClose = true;
            config.autoFocus = true;
            config.panelClass = 'custom-2fa-panel';
            config.backdropClass = 'custom-2fa-backdrop';
            config.data = {
            mensagem: isAtiva
              ? 'Deseja excluir esta empresa? Esta ação não pode ser desfeita. Funcionários vinculados a esta empresa também serão excluídos.'
              : 'Deseja reprovar esta empresa? Esta ação não pode ser desfeita.',
            botaoTexto: isAtiva ? 'Excluir' : 'Confirmar'
  };
     const dialogRef = this.dialog.open(EnderecoModalComponent, config);
      dialogRef.afterClosed().subscribe((confirmado: boolean) => {
          if (confirmado) {
    this.adminService.reprovarEmpresa(empresa.empresaId).subscribe({
      next: () => this.buscarEmpresas(this.page, this.take),
      error: (err) => console.error('Erro ao reprovar empresa:', err)
    });
      } 
    });
  }

verDetalhes(id: string): void {
  const config = new MatDialogConfig();
  config.width = '600px';
  config.maxWidth = '87%';
  config.disableClose = true;
  config.autoFocus = true;
  config.panelClass = 'custom-termo-panel';
  config.backdropClass = 'custom-2fa-backdrop';
  config.data = { id };

  this.dialog.open(DetalhesEmpresaComponent, config);
}

 
}

