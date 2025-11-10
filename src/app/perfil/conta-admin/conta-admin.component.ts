import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/login/services/auth.service';

@Component({
  selector: 'app-conta-admin',
  templateUrl: './conta-admin.component.html',
  styleUrls: ['./conta-admin.component.css']
})
export class ContaAdminComponent implements OnInit {

adminId: string | null = null;
sectionAtiva: string = 'dados';
  constructor(
    private authService: AuthService,
  ) {}

ngOnInit(): void {
 
  const id = this.authService.obterUsuarioId();
  if (id !== null) {
    this.adminId = id;
    this.selecionarSecao(this.sectionAtiva);
  } else {
    console.error('ID do candidato não encontrado no token.');
  }
}
selecionarSecao(secao: string) {
    this.sectionAtiva = secao;
  }
}

