import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgSelectModule } from "@ng-select/ng-select";
import { provideNgxMask } from "ngx-mask";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AppComponent } from "src/app/login/root/app.component";
import { EnderecoModalComponent } from "./endereco-modal/endereco-modal.component";
import { VagasComponent } from "./vagas.component";
import { MinhasVagasComponent } from "../minhas-vagas/minhas-vagas.component";
import { VagasFuncComponent } from "./vagas-func/vagas-func.component";
import { ModalVagasComponent } from "../modal-vagas/modal-vagas.component";
import { GerenciarVagaComponent } from "./vagas-func/gerenciar-vagas/gerenciar-vagas.component";
import { ModalCurriculoComponent } from "./vagas-func/gerenciar-vagas/modal-curriculo/modal-curriculo.component";
import { ModalStatusComponent } from "./vagas-func/gerenciar-vagas/modal-status/modal-status.component";

@NgModule({
  declarations: [
    VagasComponent,
    EnderecoModalComponent,
    MinhasVagasComponent,
    VagasFuncComponent,
    ModalVagasComponent,
    GerenciarVagaComponent,
    ModalCurriculoComponent,
    ModalStatusComponent,
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
    
  ],
   exports: [
    EnderecoModalComponent 
  ],
  providers: [
    provideNgxMask()
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
