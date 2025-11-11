import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {

   private apiUrl = environment.baseAPIUrl + '/endereco';

  constructor(private http: HttpClient) {}

  getEnderecoById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getEnderecoById/${id}`);
  }

  createEndereco(endereco: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createEndereco`, endereco);
  }

  updateEndereco(endereco: any, candidatoId?: string, empresaId?: string): Observable<any> {
    console.log('Atualizando endereço com ID:', endereco.enderecoId, 'para candidatoId:', candidatoId, 'ou empresaId:', empresaId);
    return this.http.put(`${this.apiUrl}/updateEndereco`, endereco, candidatoId ? { params: { candidatoId } } : empresaId ? { params: { empresaId } } : {});
  }

  deleteEndereco(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteEndereco/${id}`);
  }

  buscarCep(cep: string): Observable<any> {
  return this.http.get<any>(`https://cep.awesomeapi.com.br/json/${cep}`);
}
}