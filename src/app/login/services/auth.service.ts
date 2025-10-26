import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginDto, RegisterAdministrador, RegisterCandidato, RegisterFuncionario, TokenTemporario } from '../models/registerUsuario';
import { JwtPayload } from 'src/app/models/JwtPayload';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    apiUrl = environment.baseAPIUrl + '/auth';

  constructor(private http: HttpClient,) { }

  registerUsuario(data: RegisterCandidato): Observable<any> {
      return this.http.post(`${this.apiUrl}/register/candidato`, data);
    }
  

 registerFuncionario(data: RegisterFuncionario): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/funcionario`, data);
  }

  registerAdmin(data: RegisterAdministrador): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/admin`, data);
  }

login(dto: LoginDto): Observable<{ token?: string; doisFatoresNecessario: boolean }> {
  return this.http.post<{ token?: string; doisFatoresNecessario: boolean }>(
    `${this.apiUrl}/login`, dto
  ).pipe(
    tap(response => {
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
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

validarCodigo2FA(dto: TokenTemporario): Observable<{ sucesso: boolean; token?: string; mensagem?: string }> {
  return this.http.post<{ sucesso: boolean; token?: string; mensagem?: string }>(
    `${this.apiUrl}/validar-2fa`,
    dto
  );
}

  redefinirSenha(dto: { email: string; codigo: string; novaSenha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/redefinir-senha`, dto);
  }

  obterToken(): string | null {
    return localStorage.getItem('token');
  }

  obterUsuarioId(): string | null {
    const token = this.obterToken();
    if (!token) return null;

    try {
      const payload = jwtDecode<JwtPayload>(token);
      console.log('Payload decodificado:', payload);
      return payload.nameid || null;
    } catch (e) {
      console.error('Erro ao decodificar o token:', e);
      return null;
    }
  }



}
