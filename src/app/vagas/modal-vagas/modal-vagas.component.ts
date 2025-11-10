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
    const techArray = this.data.vaga.tecnologias ? this.data.vaga.tecnologias.split(',').map(t => t.trim()) : [];
      this.tecnologiasSelecionadas = [...techArray]; // Preenche a variável para a view
      this.formVaga.patchValue({
        titulo: this.data.vaga.titulo,
        nivel: this.data.vaga.nivel,
        escolaridade: this.data.vaga.escolaridade,
        modelo: this.data.vaga.modelo,
        area: this.data.vaga.area,
        dataAbertura: this.data.vaga.dataAbertura,
        dataFechamento: this.data.vaga.dataFechamento,
        salario: this.data.vaga.salario,
        tecnologias: this.data.vaga.tecnologias ? this.data.vaga.tecnologias.split(',') : [],
        descricao: this.data.vaga.descricao,
        requisitos: this.data.vaga.requisitos
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

  const payload = {
    empresaId: this.empresaId,
    titulo: this.formVaga.value.titulo,
    nivel: this.formVaga.value.nivel,
    escolaridade: this.formVaga.value.escolaridade,
    modelo: this.formVaga.value.modelo,
    area: this.formVaga.value.area,
    dataAbertura: this.formVaga.value.dataAbertura,
    dataFechamento: this.formVaga.value.dataFechamento,
    salario: this.formVaga.value.salario,
    tecnologias: this.tecnologiasSelecionadas.join(', '),
    descricao: this.formVaga.value.descricao,
    requisitos: this.formVaga.value.requisitos,
    ativo: true
  };

  this.vagasService.criarVaga(payload).subscribe({
    next: () => this.dialogRef.close(true)
  });
}

}