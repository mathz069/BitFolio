  import { HttpClient } from '@angular/common/http';
  import { Component, Inject, OnInit } from '@angular/core';
  import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
  import { Observable, catchError, throwError } from 'rxjs';
  import { AtualizarStatusRequest } from 'src/app/shared/models/atualizar-status-request';
  import { CandidatoVagaDTO, StatusVaga } from 'src/app/shared/models/vagas';
  import { VagaService } from 'src/app/shared/services/vagas.service';

  export interface ModalStatusData {
    candidatoVaga: CandidatoVagaDTO;
    vagaId: string;
  }

  @Component({
    selector: 'app-modal-status',
    templateUrl: './modal-status.component.html',
    styleUrls: ['./modal-status.component.css']
  })
  export class ModalStatusComponent implements OnInit {

    candidatoVaga: CandidatoVagaDTO;
    novoStatusSelecionado: StatusVaga | null = null;
    vagaId: string;
    statusOptions = [
      { value: StatusVaga.CVRecebido, label: this.getStatusText(StatusVaga.CVRecebido), icon: 'check_circle_outline' },
      { value: StatusVaga.CVRevisado, label: this.getStatusText(StatusVaga.CVRevisado), icon: 'description' },
      { value: StatusVaga.CVPreSelecionado, label: this.getStatusText(StatusVaga.CVPreSelecionado), icon: 'pending_actions' },
      { value: StatusVaga.CVSelecionado, label: this.getStatusText(StatusVaga.CVSelecionado), icon: 'verified' },
      { value: StatusVaga.CVNaoSelecionado, label: this.getStatusText(StatusVaga.CVNaoSelecionado), icon: 'cancel' }
    ];

    constructor(
      public dialogRef: MatDialogRef<ModalStatusComponent>,
      @Inject(MAT_DIALOG_DATA) public data: ModalStatusData,
      private http: HttpClient,
      private vagaService: VagaService
    ) {
      const cv = JSON.parse(JSON.stringify(data.candidatoVaga || {})) as any;

  // Se existir candidato.historicos e não existir historico (singular), preencher
  if (!cv.historico && cv.candidato?.historicos?.length) {
    cv.historico = cv.candidato.historicos[0];
  }

  // Se historico ainda não existir, garante estrutura vazia segura
  cv.historico = cv.historico ?? { historicoId: '', status: null, dtCandidatura: null, dtAtualizacao: null };

  this.candidatoVaga = cv as CandidatoVagaDTO;
  this.vagaId = data.vagaId;
    }

    ngOnInit(): void {
this.novoStatusSelecionado = this.candidatoVaga.candidato?.historicos?.[0]?.status ?? null;

    }

    getStatusText(status: number): string {
      switch (status) {
        case StatusVaga.CVRecebido: return 'Em Análise';
        case StatusVaga.CVRevisado: return 'Currículo Revisado';
        case StatusVaga.CVPreSelecionado: return 'Pré-Selecionado';
        case StatusVaga.CVSelecionado: return 'Aprovado';
        case StatusVaga.CVNaoSelecionado: return 'Não Selecionado';
        default: return 'Desconhecido';
      }
    }

    fecharModalStatus(): void {
      this.dialogRef.close();
    }

    salvarStatus(): void {
      if (this.novoStatusSelecionado === null) {
        alert('Por favor, selecione um status.');
        return;
      }

      if (this.novoStatusSelecionado === this.candidatoVaga.historico.status) {
        alert('O status selecionado é o mesmo do status atual. Nenhuma alteração será feita.');
        this.dialogRef.close();
        return;
      }

      const request: AtualizarStatusRequest = {
        candidatoId: this.candidatoVaga.candidatoId,
        vagaId: this.vagaId,
        novoStatus: this.novoStatusSelecionado
      };
      
      // Chamada para o serviço para atualizar o status
      this.vagaService.atualizarStatus(request).subscribe({
        next: (response) => {
          alert('Status atualizado com sucesso!');
          this.dialogRef.close(true); // Retorna 'true' para indicar sucesso
        },
        error: (error) => {
          console.error('Erro ao atualizar status:', error);
          // Opcional: extrair mensagem de erro mais específica da API
          let errorMessage = 'Erro ao atualizar o status. Tente novamente.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          alert(errorMessage);
        }
      });
    }
    onStatusChange(selectedStatus: StatusVaga) {
    this.novoStatusSelecionado = selectedStatus;
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
    
    getAvatarText(nome: string): string {
      return nome ? nome.charAt(0).toUpperCase() : '';
    }
  }

