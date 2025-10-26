import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Curriculo } from '../models/curriculo';

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {

 private apiUrl = environment.baseAPIUrl + '/candidato';

  constructor(private http: HttpClient) {}

  getCandidatoById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCandidatoById/${id}`);
  }

  getCandidatos(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCandidatos?page=${page}&pageSize=${pageSize}`);
  }

  updateCandidato(candidato: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateCandidato`, candidato);
  }

  deleteCandidato(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteCandidato/${id}`);
  }

  criarOuAtualizarCurriculo(candidatoId: string, curriculo: Curriculo): Observable<any> {
    return this.http.post(`${this.apiUrl}/createCurriculo/${candidatoId}`, curriculo);
  }

   getCurriculoByCandidato(candidatoId: string): Observable<Curriculo> {
    return this.http.get<Curriculo>(`${this.apiUrl}/getCurriculo/${candidatoId}`);
  }

  deleteCurriculo(curriculoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteCurriculo/${curriculoId}`);
  }
}
