import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from 'src/app/login/models/empresa';
import { Administrador } from 'src/app/models/administrador';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = environment.baseAPIUrl + '/administrador';

  constructor(private http: HttpClient) {}

  getAdministradores(page: number, take: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/getAdministradores?page=${page}&take=${take}`, {
    observe: 'response'
  });
}

  getAdministradorById(id: string): Observable<Administrador> {
    return this.http.get<Administrador>(`${this.apiUrl}/getAdministradorById/${id}`);
  }

  updateAdministrador(administrador: Administrador): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/updateAdministrador`, administrador);
  }
  deleteAdministrador(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteAdministrador/${id}`);
  }
  
  aprovarEmpresa(id: string): Observable<{ message: string, empresa: Empresa }> {
    return this.http.put<{ message: string, empresa: Empresa }>(`${this.apiUrl}/empresa/aprovar/${id}`, {});
  }

  reprovarEmpresa(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/empresa/reprovar/${id}`);
  }

  aprovarAdministrador(id: string): Observable<{ message: string, admin: Administrador }> {
  return this.http.put<{ message: string, admin: Administrador }>(
    `${this.apiUrl}/administrador/aprovar/${id}`,
    {}
  );
}

reprovarAdministrador(id: string): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(
    `${this.apiUrl}/administrador/reprovar/${id}`
  );
}

}