import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {
  tipoUsuario: 'candidato' | 'funcionario' | 'administrador' = 'candidato';
  backgroundColor: string = '#044894';

  constructor() {}

  ngOnInit(): void {
    const userType = localStorage.getItem('userType') || 'candidato';

    if (['candidato', 'funcionario', 'administrador'].includes(userType)) {
      this.tipoUsuario = userType as 'candidato' | 'funcionario' | 'administrador';

      switch (userType) {
    case 'candidato':
      this.backgroundColor = '#044894';
      break;
    case 'funcionario':
      this.backgroundColor = '#940445';
      break;
    case 'administrador':
      this.backgroundColor = '#940404';
      break;
  
  }

  document.documentElement.style.setProperty('--nav-bg-color', this.backgroundColor);
    }
  }

  getPerfilRoute(): string {
    switch (this.tipoUsuario) {
      case 'candidato': return '/perfil';
      case 'funcionario': return '/perfil-funcionario';
      case 'administrador': return '/perfil-admin';
      default: return '/perfil';
    }
  }
}