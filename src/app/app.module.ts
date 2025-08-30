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
import { provideNgxMask } from 'ngx-mask';
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
    DashboardComponent
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
  ],
  providers: [
    provideNgxMask()
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
