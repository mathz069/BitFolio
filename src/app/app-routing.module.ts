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


const routes: Routes = [
  {   path: '', component: TemplateComponent, children: [
     { path: '', redirectTo: 'login', pathMatch: 'full' },
            {path: 'login', component: LoginComponent},
            {path: 'cadastro', component: RegisterComponent},
            {path: 'cadastro-admin', component: RegisterAdminComponent},
            {path: 'cadastro-func', component: RegisterFuncComponent},
            {path: 'recuperacao-de-senha', component: ForgotPasswordComponent},
  ]
  }, {
     path: 'dashboard', component: MainNavComponent, children: [
            {path: '', component: DashboardComponent}
        ]
  },
{
    path: 'perfil',
    component: MainNavComponent,
    children: [
      { path: '', component: ContaComponent }
    ]
  },
  {
    path: 'perfil-funcionario',
    component: MainNavComponent,
    children: [
      { path: '', component: ContaFuncComponent }
    ]
  },
  {
    path: 'perfil-admin',
    component: MainNavComponent,
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
