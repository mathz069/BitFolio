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
  selector: 'app-gerenciar-candidato',
  templateUrl: './gerenciar-candidato.component.html',
  styleUrl: './gerenciar-candidato.component.css'
})
export class GerenciarCandidatoComponent {

  adminId!: string;
  administrador?: Administrador;

  candidatos: Candidato[] = [];
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
      this.buscarCandidatos();
    } else {
      console.error('ID do administrador não encontrado no token.');
    }
  }

  carregarAdmin(): void {
    this.adminService.getAdministradorById(this.adminId).subscribe({
      next: (admin) => this.administrador = admin,
      error: (err) => console.error('Erro ao buscar administrador:', err)
    });
  }

  buscarCandidatos(filtroPage?: number, takePage?: number): void {
    const page = filtroPage || this.page;
    const take = takePage || this.take;

    this.candidatoService.getCandidatos(page, take).subscribe({
      next: (res: any) => {
        this.candidatos = res.body || [];

        const totalItems = Number(res.headers.get('qtd') || this.candidatos.length);
        const range = res.headers.get('range') || '';
        this.createPagination(totalItems, page, take, range);
      },
      error: (err) => console.error('Erro ao buscar candidatos:', err)
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
  excluirCandidato(candidato: Candidato): void {
    const config = new MatDialogConfig();
    config.width = '600px';
    config.maxWidth = '87%';
    config.disableClose = true;
    config.autoFocus = true;
    config.panelClass = 'custom-2fa-panel';
    config.backdropClass = 'custom-2fa-backdrop';
    config.data = {
      mensagem: 'Deseja excluir este candidato? Esta ação não pode ser desfeita.',
      botaoTexto: 'Excluir'
    };

    const dialogRef = this.dialog.open(EnderecoModalComponent, config);
    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        this.candidatoService.deleteCandidato(candidato.id).subscribe({
          next: () => this.buscarCandidatos(this.page, this.take),
          error: (err) => console.error('Erro ao excluir candidato:', err)
        });
      }
    });
  }

anonimizarNome(nome: string | null | undefined): string {
  if (!nome) return '';

  const partes = nome.trim().split(/\s+/).filter(p => p.length > 0);
  if (partes.length === 0) return '';

  const primeiro = partes[0];
  const segundo = partes[1] || '';

  const prefixo = primeiro.length <= 3 ? primeiro : primeiro.slice(0, 3);

  if (segundo) {
    return `${prefixo}*** ${segundo.charAt(0)}.`;
  }

  // apenas um nome
  return `${prefixo}***`;
}


  anonimizarEmail(email: string): string {
    if (!email) return '';
    const [local, dominio] = email.split('@');
    if (!local) return email;
    const prefix = local.slice(0, 2);
    return `${prefix}***@${dominio}`;
  }

anonimizarNascimento(data: string | Date | null | undefined): string {
  if (!data) return '';
  const date = new Date(data);

  if (isNaN(date.getTime())) return '';

  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `**/${mm}/${yyyy}`;
}

}