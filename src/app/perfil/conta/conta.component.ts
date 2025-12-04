import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';
import { Candidato } from 'src/app/models/candidato';
import { CandidatoService } from 'src/app/shared/services/candidato.service';
import { EnderecoModalComponent } from 'src/app/vagas/vagas/endereco-modal/endereco-modal.component';
import { TermosUsoComponent } from '../termos-uso/termos-uso.component';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {

candidatoId: string | null = null;
sectionAtiva: string = 'dados';
  constructor(
    private fb: FormBuilder, 
    private candidatoService: CandidatoService, 
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
    
  ) {}

ngOnInit(): void {
 
  const id = this.authService.obterUsuarioId();
  if (id !== null) {
    this.candidatoId = id;
    this.selecionarSecao(this.sectionAtiva);
  } else {
    console.error('ID do candidato não encontrado no token.');
  }
}
selecionarSecao(secao: string) {
    this.sectionAtiva = secao;
  }
    abrirContato(): void {
    const config = new MatDialogConfig();
    config.width = '600px';
    config.maxWidth = '87%';
    config.disableClose = true;
    config.autoFocus = true;
    config.panelClass = 'custom-2fa-panel';
    config.backdropClass = 'custom-2fa-backdrop';
    config.data = {
      titulo: 'Contato',
      mensagem: 'Para suporte, dúvidas ou solicitações, entre em contato pelo e-mail: contato.bitfolio@gmail.com.br',
      botaoTexto: 'Fechar'
    };
  
    this.dialog.open(EnderecoModalComponent, config);
  }
  
  abrirTermos(): void {
  const config = new MatDialogConfig();
  config.width = '900px';
  config.maxWidth = '87%';
  config.disableClose = true;
  config.autoFocus = true;
  config.panelClass = 'custom-termo-panel';
  config.backdropClass = 'custom-2fa-backdrop';

  config.data = {
    titulo: 'TERMOS DE USO - CANDIDATO BITFOLIO',
    mensagem: `
<span class="titulo-header">I. TERMOS DE USO</span><br><br>

<span class="titulo-item">1. Função do Candidato</span><br>
O Candidato utiliza a plataforma BitFolio para gerenciar suas candidaturas e informações pessoais, incluindo:<br>
• Aplicação a vagas de emprego disponíveis na plataforma.<br>
• Atualização de informações pessoais, incluindo nome, telefone, e-mail e endereço (opcional, utilizado para busca de vagas próximas).<br>
• Inserção e atualização de seu currículo, necessário apenas para candidatura às vagas.<br><br>

<span class="titulo-item">2. Acesso aos Dados</span><br>
O Candidato declara estar ciente de que:<br><br>

<span class="titulo-item">2.1. Seus Dados Pessoais</span><br>
• Serão utilizados para processar candidaturas, comunicação com empresas e envio de notificações relevantes.<br>
• Nome, telefone, e-mail e informações do currículo poderão ser visualizados pelos funcionários das empresas às quais ele se candidatar.<br><br>

<span class="titulo-item">2.2. Dados de Vagas e Empresas</span><br>
• O Candidato terá acesso a informações sobre as vagas, incluindo descrição do cargo, requisitos e benefícios.<br>
• Poderá visualizar o nome e endereço das empresas, mas não terá acesso a informações confidenciais adicionais.<br><br>

<span class="titulo-item">3. Responsabilidades do Candidato</span><br>
O Candidato concorda em:<br>
• Fornecer informações verdadeiras, completas e atualizadas em seu perfil e currículo.<br>
• Não compartilhar sua conta ou credenciais com terceiros.<br>
• Utilizar a plataforma de forma ética e responsável.<br>
• Respeitar a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).<br><br>

O uso inadequado da plataforma poderá resultar em:<br>
• Suspensão ou exclusão da conta;<br>
• Exclusão das candidaturas associadas à conta;<br>
• Responsabilização civil ou administrativa, quando aplicável.<br><br>

<span class="titulo-item">4. Exclusão e Alteração de Conta</span><br>
O Candidato pode alterar seus dados pessoais a qualquer momento. Caso deseje excluir sua conta:<br>
• Todas as candidaturas associadas também serão excluídas.<br>
• O processo poderá ser solicitado diretamente através do e-mail:<br>
<b>suporte.bitfolio@gmail.com</b><br><br>

Após a confirmação interna:<br>
• O acesso à conta será revogado;<br>
• Todos os dados pessoais serão removidos do ambiente operacional.<br><br>

<span class="titulo-item">5. Limitações de Responsabilidade</span><br>
O Candidato reconhece que:<br>
• O BitFolio atua apenas como intermediador tecnológico.<br>
• A integridade e exatidão das informações exibidas dependem da atualização feita pelos usuários.<br>
• Nenhuma plataforma é totalmente imune a incidentes, mas medidas de segurança são adotadas para proteção dos dados.<br><br>

<span class="titulo-header">II. DISPOSIÇÕES FINAIS</span><br><br>
O BitFolio pode atualizar este documento a qualquer momento, respeitando os princípios da transparência. <br>
O uso contínuo da plataforma após as atualizações implica aceitação automática das novas condições.<br>`,
    botaoTexto: 'Fechar'
  };

  this.dialog.open(TermosUsoComponent, config);
}

}





