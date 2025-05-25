import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    title = 'JobFY';
    idleState = 'Not started.';
    timeOut = false;
    lastPing?: Date = null;
    uuid:string;
    // SystemLog:Log[]= []
    aux = {}
    count = 0
    userId=sessionStorage.getItem('user')
    ambienteLabel: string;

    idNegocio = sessionStorage.getItem('negocio')
    userEmail = sessionStorage.getItem('email')
    nomeNegocio = sessionStorage.getItem('negocioname')
    loginContent: any = {};
    constructor(private router: Router) {
       
    }
    ngOnInit() {
        if (window.location.href.includes('localhost:')) {
            this.ambienteLabel = 'Desenvolvimento';
        } 
    }
   
    reset() {
        this.idleState = 'Started.';
        this.timeOut = false;
    }
    
  getLogs(){
  
  }
  saveLog(tipo:number,descricao:string){
    let now = new Date
    let newLog = {
        DataEvento:now,
        Tipo:tipo,
        Descricao:descricao
    }
   
  }
    updateLoginContent(content: any) {
    this.loginContent = content;
  }
}
