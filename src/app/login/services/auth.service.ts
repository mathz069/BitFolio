import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginDto, RegisterAdministrador, RegisterCandidato, RegisterFuncionario } from '../models/registerUsuario';
import { JwtPayload } from 'src/app/models/JwtPayload';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    apiUrl = environment.baseAPIUrl + '/auth';

  constructor(private http: HttpClient,) { }

  registerUsuario(data: RegisterCandidato): Observable<any> {
    debugger;
      const formData = new FormData();
      const candidato = data as RegisterCandidato;
      formData.append('nome', candidato.nome);
      formData.append('email', candidato.email);
      formData.append('senha', candidato.senha);
      formData.append('dataNascimento', candidato.dataNascimento);
      formData.append('telefone', candidato.telefone);
      if (candidato.curriculoPdf) {
      formData.append('curriculoPdf', candidato.curriculoPdf, candidato.curriculoPdf.name); 
    formData.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});
      return this.http.post(`${this.apiUrl}/register/candidato`, formData);
    }
  }

 registerFuncionario(data: RegisterFuncionario): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/funcionario`, data);
  }

  registerAdmin(data: RegisterAdministrador): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/admin`, data);
  }

  login(dto: LoginDto): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, dto)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
        })
      );
  }
solicitarRecuperacaoSenha(email: string): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/recuperar-senha`, 
    JSON.stringify(email), 
    { headers: { 'Content-Type': 'application/json' } }
  );
}

  redefinirSenha(dto: { email: string; codigo: string; novaSenha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/redefinir-senha`, dto);
  }

  obterToken(): string | null {
    return localStorage.getItem('token');
  }

  obterUsuarioId(): number | null {
    const token = this.obterToken();
    if (!token) return null;

    try {
    const payload = (jwt_decode as any)(token) as JwtPayload;
      return parseInt(payload.nameid);
    } catch (e) {
      console.error('Erro ao decodificar o token:', e);
      return null;
    }
  }
}
