import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/login/services/auth.service';
import { Candidato } from 'src/app/models/candidato';
import { Curriculo, TECNOLOGIAS_PADRONIZADAS } from 'src/app/shared/models/curriculo';
import { CandidatoService } from 'src/app/shared/services/candidato.service';

@Component({
  selector: 'app-curriculo',
  templateUrl: './curriculo.component.html',
  styleUrls: ['./curriculo.component.css']
})
export class CurriculoComponent implements OnInit {
  form: FormGroup;
  editando = false;
  candidatoId: string | null = null;
  curriculoId: string | null = null;
  quill: any;

  tecnologiasDisponiveis = TECNOLOGIAS_PADRONIZADAS

  tecnologiasSelecionadas: string[] = [];

  idiomasDisponiveis = [
    'Português - Nativo', 'Inglês - Fluente', 'Inglês - Avançado', 'Inglês - Intermediário', 'Inglês - Básico',
    'Espanhol - Fluente', 'Espanhol - Avançado', 'Espanhol - Intermediário', 'Espanhol - Básico',
    'Francês - Fluente', 'Francês - Avançado', 'Francês - Intermediário', 'Francês - Básico',
    'Alemão - Fluente', 'Alemão - Avançado', 'Alemão - Intermediário', 'Alemão - Básico'
  ];
  idiomasSelecionados: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private curriculoService: CandidatoService
  ) {
    this.form = this.fb.group({
      experiencias: [''],
      competenciasTecnicas: [''],
      tecnologias: [[]],
      idiomas: [[]],
      certificacoes: ['']
    });
  }

  ngOnInit(): void {
    this.candidatoId = this.authService.obterUsuarioId();

    if (this.candidatoId) {
      this.curriculoService.getCurriculoByCandidato(this.candidatoId).subscribe({
        next: (curriculo) => {
          if (curriculo) {
            this.curriculoId = curriculo.curriculoId ?? null;
            this.preencherFormulario(curriculo);
          }
        },
        error: (err) => console.error('Erro ao buscar currículo:', err)
      });
    }

    this.toggleFormState();
  }


  preencherFormulario(curriculo: Curriculo): void {
    // Tecnologias: converte string → array
    this.tecnologiasSelecionadas =
      typeof curriculo.tecnologias === 'string'
        ? curriculo.tecnologias.split(',').map(t => t.trim())
        : curriculo.tecnologias || [];

   const idiomasParsed: string[] = typeof curriculo.idiomas === 'string'
    ? curriculo.idiomas.split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0)
    : (Array.isArray(curriculo.idiomas) ? curriculo.idiomas : (curriculo.idiomas ? [curriculo.idiomas] : []));

  // Atualiza a lista que a UI usa (botões)
  this.idiomasSelecionados = idiomasParsed;

  // Atualiza o form control com o array (ou string conforme seu fluxo; aqui mantemos array)
  this.form.patchValue({
    experiencias: curriculo.experiencias || '',
    competenciasTecnicas: curriculo.competenciasTecnicas || '',
    idiomas: idiomasParsed,
    certificacoes: curriculo.certificacoes || ''
  });

  }

  habilitarEdicao(): void {
    this.editando = true;
    this.toggleFormState();
    this.quill.enable(true);
  }

  cancelarEdicao(): void {
    this.editando = false;
    this.toggleFormState();
    this.quill.enable(false);
    this.form.reset();

    if (this.candidatoId) {
      this.curriculoService.getCurriculoByCandidato(this.candidatoId).subscribe({
        next: (curriculo) => this.preencherFormulario(curriculo)
      });
    }
  }

  salvar(): void {

    const payload = {
      curriculoId: this.curriculoId ?? undefined,
      experiencias: this.form.value.experiencias,

      tecnologias: this.tecnologiasSelecionadas.join(', '),

      competenciasTecnicas: this.form.value.competenciasTecnicas,

      idiomas: (this.form.value.idiomas || []).join(', '),

      certificacoes: this.form.value.certificacoes
    };

    if (this.candidatoId) {
      this.curriculoService.criarOuAtualizarCurriculo(this.candidatoId, payload).subscribe({
        next: () => {
          alert('Currículo salvo com sucesso!');
          this.editando = false;
          this.toggleFormState();
          this.quill.enable(false);
        },
        error: (err) => {
          console.error('Erro ao salvar currículo:', err);
          alert('Erro ao salvar currículo.');
        }
      });
    }
  }

  excluir(): void {
    if (!this.curriculoId) return;

    if (confirm('Tem certeza que deseja excluir seu currículo?')) {
      this.curriculoService.deleteCurriculo(this.curriculoId).subscribe({
        next: () => {
          alert('Currículo excluído com sucesso!');
          this.form.reset();
          this.tecnologiasSelecionadas = [];
          this.curriculoId = null;
        },
        error: (err) => console.error('Erro ao excluir currículo:', err)
      });
    }
  }

  toggleTecnologia(tech: string): void {
    if (!this.editando) return;
    const index = this.tecnologiasSelecionadas.indexOf(tech);
    if (index >= 0) {
      this.tecnologiasSelecionadas.splice(index, 1);
    } else {
      this.tecnologiasSelecionadas.push(tech);
    }
  }
  toggleIdioma(idioma: string): void {
  if (!this.editando) return;

  const index = this.idiomasSelecionados.indexOf(idioma);

  if (index >= 0) {
    this.idiomasSelecionados.splice(index, 1);
  } else {
    this.idiomasSelecionados.push(idioma);
  }

  this.form.get('idiomas')?.setValue(this.idiomasSelecionados);
}

  toggleFormState(): void {
    if (this.editando) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }
}
