import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/login/services/auth.service';
import { Administrador } from 'src/app/models/administrador';
import { Candidato } from 'src/app/models/candidato';
import { Pager } from 'src/app/shared/models/pager';
import { AdminService } from 'src/app/shared/services/admin.service';
import { CandidatoService } from 'src/app/shared/services/candidato.service';
import { EnderecoModalComponent } from 'src/app/vagas/vagas/endereco-modal/endereco-modal.component';

@Component({
  selector: 'app-gerenciar-admin',
  templateUrl: './gerenciar-admin.component.html',
  styleUrl: './gerenciar-admin.component.css'
})
export class GerenciarAdminComponent {
  adminId!: string;
  administrador?: Administrador;
  idAdminPrincipal = '019a6ff7-6da7-7ce1-a51a-3cabb8beae08';
  admins: Administrador[] = [];
  page = 1;
  take = 10;
  pager: Pager = new Pager();

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private candidatoService: CandidatoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.authService.obterUsuarioId();
    if (id) {
      this.adminId = id;
      this.carregarAdmin();
      this.buscarAdministradores();
    } else {
      console.error('ID do administrador não encontrado no token.');
    }
  }
  podeExcluir(adminId: string): boolean {
    return adminId !== this.idAdminPrincipal;
  }
  carregarAdmin(): void {
    this.adminService.getAdministradorById(this.adminId).subscribe({
      next: (admin) => this.administrador = admin,
      error: (err) => console.error('Erro ao buscar administrador:', err)
    });
  }
  formatarTelefone(telefone: string): string {
    if (!telefone) return '';
    // Remove tudo que não for número
    telefone = telefone.replace(/\D/g, '');
    
    // Formata como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (telefone.length === 11) { // celular com 9 dígitos
      return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (telefone.length === 10) { // fixo
      return telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else {
      return telefone; // caso não tenha 10 ou 11 dígitos
    }
  }
  buscarAdministradores(filtroPage?: number, takePage?: number): void {
    const page = filtroPage || this.page;
    const take = takePage || this.take;

    this.adminService.getAdministradores(page, take).subscribe({
      next: (res: any) => {
        this.admins = res.body || [];
        const totalItems = Number(res.headers.get('qtd') || this.admins.length);
        const range = res.headers.get('range') || '';
        this.createPagination(totalItems, page, take, range);
      },
      error: (err) => console.error('Erro ao buscar admins:', err)
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

  // ------------- EXCLUSÃO -------------
  excluirCandidato(admin: Administrador): void {
    const config = new MatDialogConfig();
    config.width = '600px';
    config.maxWidth = '87%';
    config.disableClose = true;
    config.autoFocus = true;
    config.panelClass = 'custom-2fa-panel';
    config.backdropClass = 'custom-2fa-backdrop';
    config.data = {
      mensagem: 'Deseja excluir este administrador? Esta ação não pode ser desfeita.',
      botaoTexto: 'Excluir'
    };

    const dialogRef = this.dialog.open(EnderecoModalComponent, config);
    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        this.adminService.deleteAdministrador(admin.id).subscribe({
          next: () => this.buscarAdministradores(this.page, this.take),
          error: (err) => console.error('Erro ao excluir candidato:', err)
        });
      }
    });
  }


aprovarAdministrador(id: string): void {
    this.adminService.aprovarAdministrador(id).subscribe({
      next: () => this.buscarAdministradores(this.page, this.take),
      error: (err) => console.error('Erro ao aprovar empresa:', err)
    });
  }

  reprovarAdministrador(admin: Administrador): void {
    const isAtiva = admin.ativo === true;
    const config = new MatDialogConfig();
            config.width = '600px';
            config.maxWidth = '87%';
            config.disableClose = true;
            config.autoFocus = true;
            config.panelClass = 'custom-2fa-panel';
            config.backdropClass = 'custom-2fa-backdrop';
            config.data = {
            mensagem: isAtiva
              ? 'Deseja excluir esta empresa? Esta ação não pode ser desfeita.'
              : 'Deseja reprovar esta empresa? Esta ação não pode ser desfeita.',
            botaoTexto: isAtiva ? 'Excluir' : 'Confirmar'
  };
     const dialogRef = this.dialog.open(EnderecoModalComponent, config);
      dialogRef.afterClosed().subscribe((confirmado: boolean) => {
          if (confirmado) {
    this.adminService.reprovarAdministrador(admin.id).subscribe({
      next: () => this.buscarAdministradores(this.page, this.take),
      error: (err) => console.error('Erro ao reprovar empresa:', err)
    });
      } 
    });
  }



  

}