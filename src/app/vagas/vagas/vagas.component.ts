import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';
import { Pager } from 'src/app/shared/models/pager';
import { VagaDTO, FiltroVagaDTO, Vaga, HistoricoCandidatura } from 'src/app/shared/models/vagas';
import { CandidatoService } from 'src/app/shared/services/candidato.service';
import { VagaService } from 'src/app/shared/services/vagas.service';
import { EnderecoModalComponent } from './endereco-modal/endereco-modal.component';
import { Candidato } from 'src/app/models/candidato';
import { ToggleFavorito } from 'src/app/shared/models/toogle-favorito';

@Component({
  selector: 'app-vagas',
  templateUrl: './vagas.component.html',
  styleUrl: './vagas.component.css'
})

export class VagasComponent implements OnInit {
  candidato: Candidato;
  vagas: VagaDTO[] = [];
 filtros: any = {
  palavrasChave: '',
  proximidade: 50,
  linguagens: {
    typescript: false,
    react: false,
    angular: false,
    nodejs: false,
    python: false,
    java: false,
    csharp: false,
    php: false,
    sql: false,
    mongodb: false,
    postgresql: false,
    aws: false,
    azure: false,
    git: false,
    flutter: false,
    figma: false
  },
  experiencia: '',
  area: '',
  modelo: ''
};

  pager: Pager = new Pager();
  page: number = 1;
  take: number = 5;
  candidatoId: string | null = null;
  historicoCandidaturas: HistoricoCandidatura[] = [];

  constructor(
    private vagaService: VagaService,
    private authService: AuthService,
    private candidatoService: CandidatoService,
    public dialog: MatDialog,
    public router: Router

  ) { }
  ngOnInit(): void {
    const usuarioId = this.authService.obterUsuarioId();

    if (usuarioId) {
      this.candidatoId = usuarioId.toString();

      this.candidatoService.getCandidatoById(this.candidatoId).subscribe({
        next: (candidato: any) => {
          this.candidato = candidato;
          const temEndereco = !!candidato.enderecoId;
          this.vagaService.getHistoricoCandidaturas(this.candidatoId).subscribe({
            next: (historico: HistoricoCandidatura[]) => {
              this.historicoCandidaturas = historico;
            },
            error: (err) => {
              console.error('Erro ao buscar histórico de candidaturas:', err);
            }
          });
          if (!temEndereco) {
            // Cria um backup do valor atual do slider de proximidade
            const backupProximidade = this.filtros.proximidade;

            // Ignora o filtro de proximidade apenas na busca
            this.filtros.proximidade = null;
            this.buscarVagas();

            // Restaura o valor visual no slider após a busca
            this.filtros.proximidade = backupProximidade;
          } else {
            // Caso tenha endereço, busca normalmente
            this.buscarVagas();
          }
        },
        error: (err) => {
          console.error('Erro ao buscar candidato:', err);
          this.buscarVagas();
        }
      });
    } else {
      console.error('Usuário não autenticado ou token inválido.');
    }
  }



  atualizarProximidade(event: any) {
    this.filtros.proximidade = event.target.value;
  }

  aplicarFiltros() {
    if (!this.candidatoId) return;

    this.candidatoService.getCandidatoById(this.candidatoId).subscribe({
      next: (candidato: any) => {
        const temEndereco = !!candidato.enderecoId;

        if (!temEndereco) {
          // Cria uma cópia do filtro para remover apenas na requisição
          const filtrosOriginais = { ...this.filtros };

          // Mostra o modal avisando que a proximidade será ignorada
          const config = new MatDialogConfig();
          config.width = '600px';
          config.maxWidth = '87%';
          config.disableClose = true;
          config.autoFocus = true;
          config.panelClass = 'custom-2fa-panel';
          config.backdropClass = 'custom-2fa-backdrop';
          config.data = {
            mensagem: 'Você não possui um endereço cadastrado. O filtro de proximidade será desconsiderado.',
            botaoTexto: 'Ir para Minha Conta'
          };

          const dialogRef = this.dialog.open(EnderecoModalComponent, config);

          dialogRef.afterClosed().subscribe((irConta: boolean) => {
            if (irConta) {
              // Redireciona somente se o usuário clicar no botão
              this.router.navigate(['/perfil']);
            }

            // Busca vagas ignorando proximidade, mas mantendo o valor visível no campo
            const filtrosSemProximidade = { ...filtrosOriginais, proximidade: null };
            const backupProximidade = this.filtros.proximidade; // mantém o valor no campo
            this.filtros.proximidade = null; // remove apenas para a busca
            this.page = 1;
            this.buscarVagas();
            this.filtros.proximidade = backupProximidade; // restaura visualmente

          });
        } else {
          // Caso tenha endereço, aplica os filtros normalmente
          this.page = 1;
          this.buscarVagas();
        }
      },
      error: (err) => {
        console.error('Erro ao buscar dados do candidato:', err);
        this.page = 1;
        this.buscarVagas();
      }
    });
  }

private obterLinguagensSelecionadas(): string[] {
  return Object.keys(this.filtros.linguagens)
    .filter(chave => this.filtros.linguagens[chave] === true)
    .map(chave => this.mapearFiltroParaNomeBanco(chave));
}

private mapearFiltroParaNomeBanco(chave: string): string {
  const mapa: any = {
    typescript: "TypeScript",
    react: "React",
    angular: "Angular",
    nodejs: "Node.js",
    python: "Python",
    java: "Java",
    csharp: "CSharp",
    php: "PHP",
    sql: "SQL",
    mongodb: "MongoDB",
    postgresql: "PostgreSQL",
    aws: "AWS",
    azure: "Azure",
    git: "Git",
    flutter: "Flutter",
    figma: "Figma"
  };

  return mapa[chave] ?? chave;
}


  limparFiltros() {
    this.filtros = {
      palavrasChave: '',
  proximidade: 50,
  linguagens: {
    typescript: false,
    react: false,
    angular: false,
    nodejs: false,
    python: false,
    java: false,
    csharp: false,
    php: false,
    sql: false,
    mongodb: false,
    postgresql: false,
    aws: false,
    azure: false,
    git: false,
    flutter: false,
    figma: false
  },
  experiencia: '',
  area: '',
  modelo: ''
    };
    this.page = 1;
    this.candidatoService.getCandidatoById(this.candidatoId).subscribe({
      next: (candidato: any) => {
        const temEndereco = !!candidato.enderecoId;
        if (!temEndereco) {
          const backupProximidade = this.filtros.proximidade;
          this.filtros.proximidade = null;
          this.buscarVagas();
          this.filtros.proximidade = backupProximidade;
        } else {
          this.buscarVagas();
        }
      },
      error: (err) => {
        console.error('Erro ao buscar dados do candidato:', err);
        this.buscarVagas();
      }
    });
  }

  buscarVagas(filtroPage?: number, takePage?: number) {
    if (!this.candidatoId) return;
    const page = filtroPage ?? this.page;
    const take = takePage ?? this.take;

    const linguagensSelecionadas: string[] = Object.keys(this.filtros.linguagens)
  .filter(key => this.filtros.linguagens[key])
  .map(key => this.mapearFiltroParaNomeBanco(key));

  const filtro: FiltroVagaDTO = {
    candidatoId: this.candidatoId,
    palavrasChave: this.filtros.palavrasChave,
    area: this.filtros.area,
    experiencia: this.filtros.experiencia,
    linguagens: linguagensSelecionadas.join(", "),
    proximidade: this.filtros.proximidade,
    modelo: this.filtros.modelo,
    page: page,
    take: take
  };

    this.vagaService.buscar(filtro, page, take)
      .subscribe((response: HttpResponse<VagaDTO[]>) => {
        this.vagas = (response.body || []).map(v => ({
          ...v,
          dataAbertura: new Date(v.dataAbertura),
          dataFechamento: new Date(v.dataFechamento),
          requisitos: Array.isArray(v.requisitos)
            ? v.requisitos
            : (v.requisitos as string)?.split(',').map(r => r.trim()) || [],
          tecnologias: Array.isArray(v.tecnologias)
            ? v.tecnologias
            : (v.tecnologias as string)?.split(',').map(t => t.trim()) || [],
          distancia: typeof v.distancia === 'number'
            ? Math.round(v.distancia * 10) / 10 
            : 0
        }));
        const qtd = Number(response.headers.get('qtd'));
        const range = response.headers.get('range') || '';
        this.createPagination(qtd, page, take, range);
        this.marcarFavoritos();
      });

  }

  trackByVagaId(index: number, vaga: VagaDTO) {
    return vaga.vagaId;
  }

  jaCandidatado(vagaId: string): boolean {
    if (!this.historicoCandidaturas) return false;
    return this.historicoCandidaturas.some(h => h.vaga.vagaId === vagaId);
  }


  marcarFavoritos(): void {
    this.vagaService.getFavoritos(this.candidatoId).subscribe((favoritos: Vaga[]) => {
      const favoritosIds = new Set(favoritos.map(v => v.vagaId));

      // Marca as vagas como favoritados
      this.vagas.forEach(v => {
        v.favoritado = favoritosIds.has(v.vagaId);
      });
    });
  }
  createPagination(totalItems: number, currentPage: number = 1, take: number = 5, range: string = '') {
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

  candidatar(vagaId: string) {
    if (!this.candidatoId) return;
    if (this.candidato.curriculoId == null || this.candidato.curriculoId === '') {
      const config = new MatDialogConfig();
      config.width = '600px';
      config.maxWidth = '87%';
      config.disableClose = true;
      config.autoFocus = true;
      config.panelClass = 'custom-2fa-panel';
      config.backdropClass = 'custom-2fa-backdrop';
      config.data = {
        mensagem: 'Você não possui um curriculo cadastrado. A candidatura não pode ser realizada.',
        botaoTexto: 'Ir para Minha Conta'
      };

      const dialogRef = this.dialog.open(EnderecoModalComponent, config);

      dialogRef.afterClosed().subscribe((irConta: boolean) => {
        if (irConta) {
          this.router.navigate(['/perfil']);
        }
      });
    } else {
      this.vagaService.candidatar(this.candidatoId, vagaId).subscribe({
        next: () => {
          alert('Candidatura realizada com sucesso!');

          this.vagaService.getHistoricoCandidaturas(this.candidatoId).subscribe({
            next: (historico: any[]) => {
              this.historicoCandidaturas = historico;
            }
          });
        },
        error: (err) => alert('Erro ao candidatar-se: ' + err.message)
      });
    }
  }

  toggleFavorito(vagaId: string): void {
    const dto: ToggleFavorito = {
      candidatoId: this.candidatoId,  // vindo do login / sessão
      vagaId: vagaId
    };

    this.vagaService.toggleFavorito(dto).subscribe({
      next: (res) => {
        // Localiza a candidatura correspondente e atualiza o estado do ícone
        const candidatura = this.vagas.find(c => c.vagaId === vagaId);
        if (candidatura) {
          candidatura.favoritado = res.favoritado;
        }
      },
      error: (err) => console.error('Erro ao favoritar/desfavoritar vaga:', err)
    });
  }

}
