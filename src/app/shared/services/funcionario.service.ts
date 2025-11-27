import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FuncionarioDTO } from '../models/curriculo';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private apiUrl = environment.baseAPIUrl + '/funcionario'; 

  constructor(private http: HttpClient) {}

  getFuncionarios(page: number, take: number) {
  return this.http.get<FuncionarioDTO[]>(
    `${this.apiUrl}/getFunc?page=${page}&take=${take}`,
    { observe: 'response' } // ← importante
  );
}

  getFuncionarioById(funcionarioId: string): Observable<FuncionarioDTO> {
    return this.http.get<FuncionarioDTO>(`${this.apiUrl}/getFuncById/${funcionarioId}`);
  }

  updateFuncionario(funcionario: FuncionarioDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/updateFuncionario`, funcionario);
  }

  deleteFuncionario(funcionarioId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteFuncionario/${funcionarioId}`);
  }
}
