import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Endereco, Empresa } from '../models/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

     apiUrlEmpresa = environment.baseAPIUrl + '/empresa';
     apiUrlEndereco = environment.baseAPIUrl + '/endereco';
  constructor(private http: HttpClient) {}

  // ========== EMPRESA ==========

  createEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(`${this.apiUrlEmpresa}/createEmp`, empresa);
  }

  getEmpresas(page: number = 1, pageSize: number = 10): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrlEmpresa}/getEmpresas?page=${page}&pageSize=${pageSize}`);
  }

  getEmpresaById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrlEmpresa}/getEmpresasById/${id}`);
  }

  updateEmpresa(empresa: Empresa): Observable<void> {
    return this.http.put<void>(`${this.apiUrlEmpresa}/updateEmp`, empresa);
  }

  deleteEmpresa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlEmpresa}/deleteEmp/${id}`);
  }
  // ========== ENDEREÇO ==========

  createEndereco(endereco: Endereco): Observable<Endereco> {
    return this.http.post<Endereco>(`${this.apiUrlEndereco}/createEndereco`, endereco);
  }

  getEnderecoById(id: number): Observable<Endereco> {
    return this.http.get<Endereco>(`${this.apiUrlEndereco}/getEnderecoById/${id}`);
  }

  updateEndereco(endereco: Endereco): Observable<void> {
    return this.http.put<void>(`${this.apiUrlEndereco}/updateEndereco`, endereco);
  }

  deleteEndereco(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlEndereco}/deleteEndereco/${id}`);
  }
}
