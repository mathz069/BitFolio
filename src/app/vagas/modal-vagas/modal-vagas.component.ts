import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/login/services/auth.service';
import { FuncionarioDTO } from 'src/app/shared/models/curriculo';
import { Vaga } from 'src/app/shared/models/vagas';
import { FuncionarioService } from 'src/app/shared/services/funcionario.service';
import { VagaService } from 'src/app/shared/services/vagas.service';

@Component({
  selector: 'app-modal-vagas',
  templateUrl: './modal-vagas.component.html',
  styleUrl: './modal-vagas.component.css'
})
export class ModalVagasComponent {

   formVaga!: FormGroup;

  tecnologiasLista: string[] = [
    'Angular', 'React', 'Vue', 'Node.js', 'C#', 'Java', 'Python', 'PHP',
    'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Flutter'
  ];
  funcionarioId: string | null = null;
  empresaId: string | null = null;
  tecnologiasSelecionadas: string[] = [];
  funcionario: FuncionarioDTO | null = null;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalVagasComponent>,
    private authService: AuthService,
    private vagasService: VagaService,
    private funcionarioService: FuncionarioService,
    @Inject(MAT_DIALOG_DATA) public data: { vaga: Vaga },
  ) {}

 ngOnInit(): void {
  const usuario = this.authService.obterUsuarioId();

  if (usuario) {
        this.funcionarioId = usuario.toString();
     this.funcionarioService.getFuncionarioById(this.funcionarioId).subscribe({
      next: (funcionario) => {
        this.funcionario = funcionario;
        this.empresaId = funcionario.empresaId || null;
      }}
  );
}

  this.formVaga = this.fb.group({
    titulo: ['', Validators.required],
    nivel: [''],
    escolaridade: [''],
    modelo: [''],
    area: [''],
    dataAbertura: [''],
    dataFechamento: [''],
    salario: [null],
    tecnologias: [[]],
    descricao: [''],
    requisitos: ['']
  });
  console.log(this.data.vaga);
  if (this.data.vaga) {
  const techArray = Array.isArray(this.data.vaga.tecnologias) 
      ? [...this.data.vaga.tecnologias] 
      : (this.data.vaga.tecnologias ? this.data.vaga.tecnologias.split(',').map(t => t.trim()) : []);

  this.tecnologiasSelecionadas = [...techArray];

  const formatDate = (date: Date | string) => {
    if (!date) return '';
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  this.formVaga.patchValue({
    titulo: this.data.vaga.titulo,
    nivel: this.data.vaga.nivel,
    escolaridade: this.data.vaga.escolaridade,
    modelo: this.data.vaga.modelo,
    area: this.data.vaga.area,
    dataAbertura: formatDate(this.data.vaga.dataAbertura),
    dataFechamento: formatDate(this.data.vaga.dataFechamento),
    salario: this.data.vaga.salario,
    tecnologias: techArray,
    descricao: Array.isArray(this.data.vaga.descricao) ? this.data.vaga.descricao.join(', ') : this.data.vaga.descricao,
requisitos: Array.isArray(this.data.vaga.requisitos) ? this.data.vaga.requisitos.join(', ') : this.data.vaga.requisitos
  });
}
}

  toggleTecnologia(tech: string): void {
    const index = this.tecnologiasSelecionadas.indexOf(tech);

    if (index >= 0) {
      this.tecnologiasSelecionadas.splice(index, 1);
    } else {
      this.tecnologiasSelecionadas.push(tech);
    }
  }

  fechar(): void {
    this.dialogRef.close(false);
  }

 salvar(): void {
  if (this.formVaga.invalid || !this.empresaId) return;

  // Cria uma cópia da vaga original ou um objeto novo se for criação
  const vagaPayload: Vaga = this.data.vaga
    ? { ...this.data.vaga } // copia a vaga existente
    : { vagaId: null, empresaId: this.empresaId, ativo: true } as Vaga;

  // Sobrescreve com os valores do formulário
  vagaPayload.titulo = this.formVaga.value.titulo;
  vagaPayload.nivel = this.formVaga.value.nivel;
  vagaPayload.escolaridade = this.formVaga.value.escolaridade;
  vagaPayload.modelo = this.formVaga.value.modelo;
  vagaPayload.area = this.formVaga.value.area;
  vagaPayload.dataAbertura = this.formVaga.value.dataAbertura;
  vagaPayload.dataFechamento = this.formVaga.value.dataFechamento;
  vagaPayload.salario = this.formVaga.value.salario;
  vagaPayload.tecnologias = this.tecnologiasSelecionadas.join(', ');
  vagaPayload.descricao = this.formVaga.value.descricao;
  vagaPayload.requisitos = this.formVaga.value.requisitos;
  vagaPayload.empresaId = this.empresaId; 
  vagaPayload.ativo = true;

  if (vagaPayload.vagaId) {
    this.vagasService.updateVaga(vagaPayload).subscribe({
      next: () => this.dialogRef.close(true)
    });
  } else {
    this.vagasService.criarVaga(vagaPayload).subscribe({
      next: () => this.dialogRef.close(true)
    });
  }
}


}