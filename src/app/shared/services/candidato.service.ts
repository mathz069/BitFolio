import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {

 private apiUrl = environment.baseAPIUrl + '/candidato';

  constructor(private http: HttpClient) {}

  getCandidatoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCandidatoById/${id}`);
  }

  getCandidatos(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCandidatos?page=${page}&pageSize=${pageSize}`);
  }

  updateCandidato(candidato: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateCandidato`, candidato);
  }

  deleteCandidato(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteCandidato/${id}`);
  }
}
