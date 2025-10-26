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

@NgModule({
  declarations: [
    VagasComponent,
    EnderecoModalComponent
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
  providers: [
    provideNgxMask()
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
