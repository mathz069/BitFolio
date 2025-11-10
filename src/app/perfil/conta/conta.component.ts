import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';
import { Candidato } from 'src/app/models/candidato';
import { CandidatoService } from 'src/app/shared/services/candidato.service';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {

candidatoId: string | null = null;
sectionAtiva: string = 'dados';
  constructor(
    private fb: FormBuilder, 
    private candidatoService: CandidatoService, 
    private authService: AuthService,
    private router: Router
  ) {}

ngOnInit(): void {
 
  const id = this.authService.obterUsuarioId();
  if (id !== null) {
    this.candidatoId = id;
    this.selecionarSecao(this.sectionAtiva);
  } else {
    console.error('ID do candidato não encontrado no token.');
  }
}
selecionarSecao(secao: string) {
    this.sectionAtiva = secao;
  }
}





