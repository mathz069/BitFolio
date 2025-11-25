import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { RegisterComponent } from './login/register/register.component';
import { TemplateComponent } from './login/template/template.component';
import { RegisterAdminComponent } from './login/register-admin/register-admin.component';
import { RegisterFuncComponent } from './login/register-func/register-func.component';
import { MainNavComponent } from './shared/main-nav/main-nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContaAdminComponent } from './perfil/conta-admin/conta-admin.component';
import { ContaComponent } from './perfil/conta/conta.component';
import { ContaFuncComponent } from './perfil/conta-func/conta-func.component';
import { VagasComponent } from './vagas/vagas/vagas.component';
import { MinhasVagasComponent } from './vagas/minhas-vagas/minhas-vagas.component';
import { VagasFuncComponent } from './vagas/vagas/vagas-func/vagas-func.component';
import { GerenciarVagaComponent } from './vagas/vagas/vagas-func/gerenciar-vagas/gerenciar-vagas.component';
import { authGuard } from './shared/guards/auth.guard';
import { roleGuard } from './shared/guards/role.guard';


const routes: Routes = [

  // ROTAS PÚBLICAS (sem login)
  {
    path: '',
    component: TemplateComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'cadastro', component: RegisterComponent },
      { path: 'cadastro-admin', component: RegisterAdminComponent },
      { path: 'cadastro-func', component: RegisterFuncComponent },
      { path: 'recuperacao-de-senha', component: ForgotPasswordComponent },
    ]
  },

  // ROTAS CANDIDATO
  {
    path: 'dashboard',
    component: MainNavComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['candidato'] },
    children: [
      { path: '', component: DashboardComponent }
    ]
  },

  {
    path: 'perfil',
    component: MainNavComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['candidato'] },
    children: [
      { path: '', component: ContaComponent }
    ]
  },

  {
    path: 'vagas',
    component: MainNavComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['candidato'] },
    children: [
      { path: '', component: VagasComponent }
    ]
  },

  {
    path: 'inscricoes',
    component: MainNavComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['candidato'] },
    children: [
      { path: '', component: MinhasVagasComponent }
    ]
  },

  // ROTAS FUNCIONÁRIO
  {
    path: 'perfil-funcionario',
    component: MainNavComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['funcionario'] },
    children: [
      { path: '', component: ContaFuncComponent }
    ]
  },

  {
    path: 'gerenciar-vagas',
    component: MainNavComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['funcionario'] },
    children: [
      { path: '', component: VagasFuncComponent },
      { path: 'vaga/:id', component: GerenciarVagaComponent }
    ]
  },

  // ROTAS ADMINISTRADOR
  {
    path: 'perfil-admin',
    component: MainNavComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['administrador'] },
    children: [
      { path: '', component: ContaAdminComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
