import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-conta-admin',
  templateUrl: './conta-admin.component.html',
  styleUrls: ['./conta-admin.component.css']
})
export class ContaAdminComponent implements OnInit {
editando = false;
form: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
