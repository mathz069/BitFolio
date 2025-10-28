import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AtualizarStatusRequest } from '../models/atualizar-status-request';
import { ToggleFavorito } from '../models/toogle-favorito';
import { FiltroVagaDTO, HistoricoCandidatura, Vaga, VagaDTO } from '../models/vagas';

@Injectable({
  providedIn: 'root'
})
export class VagaService {

  private apiUrl = environment.baseAPIUrl + '/vagas';

  constructor(private http: HttpClient) {}

  /** Retorna todas as vagas com paginação */
  getVagas(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/getVagas?page=${page}&pageSize=${pageSize}`);
  }

  /** Retorna vagas de uma empresa específica */
  getVagasByNegocio(empresaId: string): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(`${this.apiUrl}/getVagasByNegocio/${empresaId}`);
  }

  /** Retorna uma vaga pelo ID */
  getVagaById(id: string): Observable<Vaga> {
    return this.http.get<Vaga>(`${this.apiUrl}/getVagasById/${id}`);
  }

  /** Cria uma nova vaga */
  criarVaga(vaga: Vaga): Observable<Vaga> {
    return this.http.post<Vaga>(`${this.apiUrl}/criarVaga`, vaga);
  }

  /** Atualiza uma vaga existente */
  updateVaga(vaga: Vaga): Observable<Vaga> {
    return this.http.put<Vaga>(`${this.apiUrl}/updateVaga`, vaga);
  }

  /** Exclui uma vaga */
  deleteVaga(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteVaga/${id}`);
  }

  /** Favoritar/Desfavoritar vaga */
  toggleFavorito(dto: ToggleFavorito): Observable<{ favoritado: boolean }> {
  return this.http.post<{ favoritado: boolean }>(`${this.apiUrl}/toggleFavorito`, dto);
}

  /** Retorna vagas favoritas de um candidato */
  getFavoritos(candidatoId: string): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(`${this.apiUrl}/favoritos/${candidatoId}`);
  }

  /** Busca vagas por palavra-chave (com paginação) */
buscar(filtros: FiltroVagaDTO, page: number = 1, take: number = 10): Observable<HttpResponse<VagaDTO[]>> {
  let params = new HttpParams();

  if (filtros.candidatoId)
    params = params.set('candidatoId', filtros.candidatoId);

  if (filtros.palavrasChave?.trim())
    params = params.set('palavrasChave', filtros.palavrasChave.trim());

  if (filtros.area)
    params = params.set('area', filtros.area);

  if (filtros.experiencia)
    params = params.set('experiencia', filtros.experiencia);

  if (filtros.linguagens && filtros.linguagens.length > 0)
    params = params.set('linguagens', filtros.linguagens.join(','));

  if (filtros.proximidade && filtros.proximidade > 0)
    params = params.set('proximidade', filtros.proximidade.toString());
  if (filtros.modelo)
    params = params.set('modelo', filtros.modelo);
  params = params.set('page', page.toString());
  params = params.set('take', take.toString());

  return this.http.get<VagaDTO[]>(`${this.apiUrl}/buscar`, { params, observe: 'response' });
}


getHistoricoCandidaturas(candidatoId: string): Observable<HistoricoCandidatura[]> {
  return this.http.get<HistoricoCandidatura[]>(`${this.apiUrl}/historico/${candidatoId}`);
}

  /** Candidatar um candidato a uma vaga */
  candidatar(candidatoId: string, vagaId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${candidatoId}/${vagaId}`, {});
  }

  /** Atualizar o status da candidatura */
  atualizarStatus(request: AtualizarStatusRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/atualizar-status`, request);
  }

  
}
