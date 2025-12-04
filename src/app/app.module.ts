import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './login/root/app.component';
import { LoginComponent } from './login/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplateComponent } from './login/template/template.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { MainNavComponent } from './shared/main-nav/main-nav.component';
import { RegisterComponent } from './login/register/register.component';
import { RegisterAdminComponent } from './login/register-admin/register-admin.component';
import { RegisterFuncComponent } from './login/register-func/register-func.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { EmpresaModalComponent } from './login/modal/empresa-modal/empresa-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContaFuncComponent } from './perfil/conta-func/conta-func.component';
import { ContaAdminComponent } from './perfil/conta-admin/conta-admin.component';
import { ContaComponent } from './perfil/conta/conta.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { VagasComponent } from './vagas/vagas/vagas.component';
import { CommonModule } from '@angular/common';
import { DoisFatoresModalComponent } from './login/login/dois-fatores-modal/dois-fatores-modal.component';
import { EnderecoModalComponent } from './vagas/vagas/endereco-modal/endereco-modal.component';
import { EnderecoComponent } from './perfil/conta/endereco/endereco.component';
import { CurriculoComponent } from './perfil/conta/curriculo/curriculo.component';
import { DadosComponent } from './perfil/conta/meus-dados/meus-dados.component';
import { DadosFuncionarioComponent } from './perfil/conta-func/dados-funcionario/dados-funcionario.component';
import { DadosAdminComponent } from './perfil/conta-admin/dados-admin/dados-admin.component';
import { EnderecoEmpresaComponent } from './perfil/conta-func/endereco-empresa/endereco-empresa.component';
import { GerenciarEmpresaComponent } from './perfil/conta-admin/gerenciar-empresa/gerenciar-empresa.component';
import { DetalhesEmpresaComponent } from './perfil/conta-admin/gerenciar-empresa/detalhes-empresa/detalhes-empresa.component';
import { GerenciarCandidatoComponent } from './perfil/conta-admin/gerenciar-candidato/gerenciar-candidato.component';
import { GerenciarFuncComponent } from './perfil/conta-admin/gerenciar-func/gerenciar-func.component';
import { DadosEmpresaComponent } from './perfil/conta-func/dados-empresa/dados-empresa.component';
import { GerenciarAdminComponent } from './perfil/conta-admin/gerenciar-admin/gerenciar-admin.component';
@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    RegisterComponent,
    LoginComponent,
    TemplateComponent,
    ForgotPasswordComponent,
    RegisterAdminComponent,
    RegisterFuncComponent,
    EmpresaModalComponent,
    ContaFuncComponent,
    ContaAdminComponent,
    ContaComponent,
    DashboardComponent,
    DoisFatoresModalComponent,
    EnderecoComponent,
    CurriculoComponent,
    DadosComponent,
    DadosFuncionarioComponent,
    DadosAdminComponent,
    EnderecoEmpresaComponent,
    GerenciarEmpresaComponent,
    DetalhesEmpresaComponent,
    GerenciarCandidatoComponent,
    GerenciarFuncComponent,
    DadosEmpresaComponent,
    GerenciarAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    NgSelectModule,
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [
    provideNgxMask()
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
