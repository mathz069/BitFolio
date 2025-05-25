import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {

form: FormGroup;
  editando = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: [{ value: 'Matheus Cabral', disabled: false }],
      email: [{ value: 'matheus@email.com', disabled: false }],
      dataNascimento: [{ value: '1995-07-14', disabled: false }],
      telefone: [{ value: '(11) 91234-5678', disabled: false }]
    });

    this.toggleFormState(); // Inicia com os campos desabilitados
  }

  toggleEdicao(): void {
    this.editando = !this.editando;
    this.toggleFormState();

    if (!this.editando) {
      // Aqui você pode enviar os dados atualizados
      console.log('Dados atualizados:', this.form.value);
    }
  }

  private toggleFormState(): void {
    if (this.editando) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }
}





