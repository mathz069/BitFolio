import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';
import { CandidatoService } from 'src/app/shared/services/candidato.service';
import { EnderecoModalComponent } from 'src/app/vagas/vagas/endereco-modal/endereco-modal.component';
import { TermosUsoComponent } from '../termos-uso/termos-uso.component';

@Component({
  selector: 'app-conta-func',
  templateUrl: './conta-func.component.html',
  styleUrls: ['./conta-func.component.css']
})
export class ContaFuncComponent implements OnInit {

funcionarioId: string | null = null;
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
    this.funcionarioId = id;
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
    titulo: 'TERMOS DE USO - FUNCIONÁRIO BITFOLIO',
    mensagem: `
<span class="titulo-header">I. TERMOS DE USO</span><br><br>

<span class="titulo-item">1. Função do Funcionário</span><br>
O Funcionário cadastrado por uma empresa utiliza a plataforma BitFolio para gerenciar vagas e analisar candidaturas, incluindo:<br>
• Criação, edição e encerramento de vagas da empresa à qual está vinculado.<br>
• Gerenciamento e análise de candidaturas recebidas para as vagas da empresa.<br>
• Edição de dados da empresa e endereço, mediante aprovação da empresa via e-mail.<br><br>

<span class="titulo-item">2. Acesso aos Dados</span><br>
O Funcionário declara estar ciente de que:<br><br>

<span class="titulo-item">2.1. Dados de Candidatos</span><br>
• Poderá visualizar nome, telefone, e-mail e currículo completo apenas dos candidatos que se candidataram às vagas da empresa na qual trabalha.<br>
• Não terá acesso a candidatos de outras empresas.<br><br>

<span class="titulo-item">2.2. Dados da Empresa</span><br>
• O Funcionário poderá acessar e, quando autorizado, editar informações da empresa à qual está vinculado, incluindo endereço e dados gerais.<br>
• Todas as alterações significativas devem ser aprovadas pela empresa via e-mail.<br>
• Não terá acesso a informações de outras empresas ou seus funcionários.<br><br>

<span class="titulo-item">3. Responsabilidades do Funcionário</span><br>
O Funcionário concorda em:<br>
• Utilizar os dados dos candidatos exclusivamente para processos seletivos e comunicação interna da empresa.<br>
• Manter a confidencialidade das informações de candidatos e da empresa.<br>
• Não compartilhar ou divulgar dados pessoais sem consentimento.<br>
• Fornecer informações verdadeiras e atualizadas ao criar e gerenciar vagas.<br>
• Cumprir a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).<br>
• Reportar imediatamente qualquer uso indevido, falha ou incidente de segurança.<br><br>

O uso inadequado da plataforma poderá resultar em:<br>
• Suspensão ou exclusão da conta do funcionário;<br>
• Perda de acesso a dados de candidatos e vagas;<br>
• Responsabilização civil, administrativa ou legal.<br><br>

<span class="titulo-item">4. Exclusão e Alteração de Conta e Vagas</span><br>
O Funcionário pode alterar seus dados pessoais a qualquer momento. Para excluir a conta:<br>
• Todos os dados pessoais serão removidos.<br>
• O acesso à plataforma será revogado.<br><br>

Quando uma vaga for deletada pelo funcionário:<br>
• Todas as candidaturas e histórico de candidatos daquela vaga serão permanentemente perdidos.<br><br>

Solicitações de alteração ou exclusão podem ser feitas através do e-mail:<br>
<b>suporte.bitfolio@gmail.com</b><br><br>

<span class="titulo-item">5. Limitações de Responsabilidade</span><br>
O Funcionário reconhece que:<br>
• O BitFolio atua como intermediador tecnológico, não sendo responsável pelos processos seletivos ou decisões da empresa.<br>
• A integridade e exatidão das informações exibidas dependem da atualização feita por candidatos e empresas.<br>
• Nenhuma plataforma é totalmente imune a incidentes, mas medidas de segurança são adotadas para proteção dos dados.<br><br>

<span class="titulo-header">II. DISPOSIÇÕES FINAIS</span><br><br>
O BitFolio pode atualizar este documento a qualquer momento, respeitando os princípios da transparência.<br>
O uso contínuo da plataforma após as atualizações implica aceitação automática das novas condições.<br>`,
    botaoTexto: 'Fechar'
  };

  this.dialog.open(TermosUsoComponent, config);
}

}

