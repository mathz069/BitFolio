import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDto } from '../models/registerUsuario';
import { AuthService } from '../services/auth.service';
import { UsertypeService } from '../services/usertype.service';
import { Observable } from 'rxjs';
import { DoisFatoresModalComponent } from './dois-fatores-modal/dois-fatores-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit  {
    userType: 'funcionario' | 'candidato' | 'administrador' = 'candidato';
    passwordField: string;
    eyeSource: string;
    form: FormGroup;
    errorEmail: string;
    errorPassword: string;
    userId: string;
    paramJornada: boolean = false;
    mensagem = 'Usuário não possui acesso ao ';
    session:string;
    loginIn = false
    isDialogOpen = false
    capsLockOn: boolean = false; // Variável para rastrear o estado do CapsLock
    // Observable para os dados do tipo de usuário  
    userTypeData$: Observable<{ imageSrc: string, text: string, backgroundColor: string, backgroundImage: string }>;

    constructor(
                private formBuilder: FormBuilder,
                private authService: AuthService,
                private router: Router,
                private userTypeService: UsertypeService,
                public dialog: MatDialog
    ) {
        this.passwordField = 'password';
        this.eyeSource = './assets/images/invisibility.svg';
        
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
        this.userTypeData$ = this.userTypeService.userTypeData$;

        const savedType = localStorage.getItem('userType') as 'funcionario' | 'candidato' | 'administrador' | null;
        this.userType = savedType !== null && savedType !== undefined ? savedType : 'candidato';
      
    }
    setUserType(tipo: 'funcionario' | 'candidato' | 'administrador') {
    this.userType = tipo;
    this.userTypeService.setUserType(tipo); 
    this.userTypeService.userTypeData$.subscribe(userTypeData => {
    console.log('Dados do tipo de usuário:', userTypeData);
  });
    this.router.navigate(['/login']); 
  }
 

    getCadastroRoute(userTypeData: { backgroundColor: string } | null): string[] {
  if (!userTypeData) {
    return ['/cadastro'];
  }

  if (userTypeData.backgroundColor === '#044894') {
    return ['/cadastro'];
  } else if (userTypeData.backgroundColor === '#940404') {
    return ['/cadastro-admin'];
  } else if (userTypeData.backgroundColor === '#940445') {
    return ['/cadastro-func'];
  }
  return ['/cadastro'];
}
getRecuperacaoSenhaRoute(userTypeData: { backgroundColor: string } | null): string[] {
  if (!userTypeData) {
    return ['/recuperacao-de-senha']; // padrão
  }

  if (userTypeData.backgroundColor === '#044894') {
    // Candidato
    return ['/recuperacao-de-senha'];
  } else if (userTypeData.backgroundColor === '#940404') {
    // Administrador
    return ['/recuperacao-de-senha'];
  } else if (userTypeData.backgroundColor === '#940445') {
    // Funcionário
    return ['/recuperacao-de-senha'];
  }

  return ['/recuperacao-de-senha']; // fallback padrão
}
    changeFieldType($event) {
        $event.preventDefault();
        if (this.passwordField === 'text') {
            this.passwordField = 'password';
            this.eyeSource = './assets/images/invisibility.svg';
        } else {
            this.passwordField = 'text';
            this.eyeSource = './assets/images/visibility.svg';
        }
    }

login($event: Event) {
  $event.preventDefault();

  if (this.form.invalid) {
    this.errorEmail = this.form.controls.email.invalid ? 'Email inválido' : '';
    this.errorPassword = this.form.controls.password.invalid ? 'Senha inválida' : '';
    return;
  }

  this.errorEmail = '';
  this.errorPassword = '';
  this.loginIn = true;

  const tipo = (localStorage.getItem('userType') || 'candidato') as 'candidato' | 'funcionario' | 'administrador';
  const dto: LoginDto = {
    email: this.form.value.email,
    senha: this.form.value.password,
    tipo: tipo
  };

  this.authService.login(dto).subscribe({
    next: function (response) {
      this.loginIn = false;

if (response.doisFatoresNecessario) {
    const config = new MatDialogConfig();
    config.width = '600px';
    config.maxWidth = '87%';
    config.disableClose = true;
    config.autoFocus = true;
    config.panelClass = 'custom-2fa-panel'
    config.backdropClass = 'custom-2fa-backdrop';
    const dialogRef = this.dialog.open(DoisFatoresModalComponent, config);

        dialogRef.afterClosed().subscribe(codigo => {
          if (codigo) {
            this.verificarCodigo2FA(codigo, dto.email);
          }
        });

      } else if (response.token) {
        this.router.navigate(['/dashboard']);
      }
    }.bind(this),
    error: function (err) {
      this.loginIn = false;

      var mensagem = 'Credenciais inválidas.';
      var tentativas = null;

      if (err && err.error) {
        if (err.error.mensagem) {
          mensagem = err.error.mensagem;
        }
        if (typeof err.error.tentativasRestantes === 'number') {
          tentativas = err.error.tentativasRestantes;
        }
      }

      // Verifica se a conta está bloqueada
      if (mensagem.toLowerCase().includes("bloqueado") || mensagem.toLowerCase().includes("bloqueada")) {
        alert("Seu login foi temporariamente bloqueado. Aguarde 15 minutos antes de tentar novamente.");
      }
      else if (tentativas !== null) {
        alert(mensagem + ' Tentativas restantes: ' + tentativas);
      } else {
        alert(mensagem);
      }

      this.errorEmail = mensagem;
      this.errorPassword = mensagem;
    }.bind(this)
  });
}


  checkCapsLock(event: KeyboardEvent) {
  // O método getModifierState detecta se o CapsLock está ativo
  this.capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
}
   setBorder(field: string) {
  switch (field) {
    case 'email':
      if (this.errorEmail) {
        return '1px solid #FFAAA5';
      }
      return '1px solid #F1F1F5';
    case 'password':
      if (this.errorPassword) {
        return '1px solid #FFAAA5';
      }
      if (this.capsLockOn) {
        return '1px solid orange';
      }
      return '1px solid #F1F1F5';
  }
}

verificarCodigo2FA(codigo: string, email: string) {
  this.authService.validarCodigo2FA({ email, codigo }).subscribe({
    next: (res) => {
      if (res.sucesso && res.token) {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      } else {
        alert(res.mensagem || 'Código inválido');
      }
    },
    error: () => {
      alert('Erro ao validar o código 2FA');
    }
  });
}

}
