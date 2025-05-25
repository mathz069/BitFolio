import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsertypeService {

  private _userTypeDataSubject = new BehaviorSubject<{ imageSrc: string, text: string, backgroundColor: string, backgroundImage: string }>({
    imageSrc: './assets/images/logo-candidato.png',
    text: 'Bem-vindo de volta! Acesse sua conta e encontre a vaga ideal para o seu perfil.',
    backgroundColor: '#044894',
    backgroundImage: '/assets/images/3.png'
  });

  get userTypeData$() {
    return this._userTypeDataSubject.asObservable();
  }

  // Função para setar os dados do tipo de usuário
  setUserType(type: 'funcionario' | 'candidato' | 'administrador'): void {
    const data = this.getUserTypeDataByType(type);
    localStorage.setItem('userType', type);
    this._userTypeDataSubject.next(data); // Atualiza o observable
  }

  // Função privada que retorna os dados específicos para cada tipo de usuário
  private getUserTypeDataByType(type: 'funcionario' | 'candidato' | 'administrador'): { imageSrc: string, text: string, backgroundColor: string, backgroundImage: string } {
    const userTypeMap = {
      candidato: {
        imageSrc: './assets/images/3.png',
        text: 'Bem-vindo de volta! Acesse sua conta e encontre a vaga ideal para o seu perfil.',
        backgroundColor: '#044894',
        backgroundImage: '/assets/images/3.png'
      },
      funcionario: {
        imageSrc: './assets/images/3-vermelho.png',
        text: 'Bem-vindo de volta! Revise currículos e ajude sua empresa a contratar com mais precisão.',
        backgroundColor: '#940445',
        backgroundImage: '/assets/images/3-roxo.png'
      },
      administrador: {
        imageSrc: './assets/images/3.png',
        text: 'Bem-vindo de volta! Crie vagas, acompanhe inscrições e otimize seu processo seletivo.',
        backgroundColor: '#940404',
        backgroundImage: '/assets/images/3-vermelho.png'

      }
    };
    
    return userTypeMap[type];
  }
}