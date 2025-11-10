import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';
import { CandidatoService } from 'src/app/shared/services/candidato.service';

@Component({
  selector: 'app-conta-func',
  templateUrl: './conta-func.component.html',
  styleUrls: ['./conta-func.component.css']
})
export class ContaFuncComponent implements OnInit {

funcionarioId: string | null = null;
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
    this.funcionarioId = id;
    this.selecionarSecao(this.sectionAtiva);
  } else {
    console.error('ID do candidato não encontrado no token.');
  }
}
selecionarSecao(secao: string) {
    this.sectionAtiva = secao;
  }
}

