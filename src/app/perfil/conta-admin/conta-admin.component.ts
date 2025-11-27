import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/login/services/auth.service';
import { EnderecoModalComponent } from 'src/app/vagas/vagas/endereco-modal/endereco-modal.component';
import { TermosUsoComponent } from '../termos-uso/termos-uso.component';

@Component({
  selector: 'app-conta-admin',
  templateUrl: './conta-admin.component.html',
  styleUrls: ['./conta-admin.component.css']
})
export class ContaAdminComponent implements OnInit {

adminId: string | null = null;
sectionAtiva: string = 'dados';
  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

ngOnInit(): void {
 
  const id = this.authService.obterUsuarioId();
  if (id !== null) {
    this.adminId = id;
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
    titulo: 'TERMOS DE USO ADMINISTRADOR- BITFOLIO',
    mensagem: `
<span class="titulo-header">I. TERMOS DE USO</span><br><br>

<span class="titulo-item">1. Função do Administrador</span><br>
O Administrador é responsável pela gestão interna da plataforma BitFolio, incluindo:<br>
• Moderação, aprovação e reprovação de empresas, funcionários e candidatos cadastradas.<br>
• Acompanhamento operacional da plataforma.<br>
• Suporte interno aos usuários.<br>
• Verificação de inconsistências, uso indevido e manutenção da integridade dos dados.<br><br>

<span class="titulo-item">2. Acesso aos Dados</span><br>
O Administrador declara estar ciente de que possui acesso a informações específicas e limitadas, conforme descrito abaixo:<br><br>

<span class="titulo-item">2.1. Dados de Candidatos e Funcionários</span><br>
O Administrador poderá visualizar:<br>
• Dados anonimizados de candidatos e funcionários para garantir conformidade do sistema.<br>
• Dados agregados utilizados para monitoramento do sistema, sem identificação direta dos usuários.<br>
O Administrador não terá acesso ao conteúdo completo de perfis, currículos ou informações pessoais de forma nominal.<br><br>

<span class="titulo-item">2.2. Dados de Empresas</span><br>
O Administrador poderá visualizar:<br>
• Dados completos de empresas cadastradas.<br>
• Dados de responsáveis vinculados a cada empresa.<br>
• Informações referentes ao processo de aprovação, reprovação e status da empresa.<br><br>

<span class="titulo-item">2.3. Dados de Outros Administradores</span><br>
Para fins de auditoria, segurança e integridade da plataforma, o Administrador poderá visualizar:<br>
• Nome, e-mail e telefone de outros administradores.<br><br>

<span class="titulo-item">3. Responsabilidades do Administrador</span><br>
O Administrador concorda em:<br>
• Utilizar os dados exclusivamente para fins operacionais e administrativos.<br>
• Não compartilhar, redistribuir, copiar ou divulgar informações internas da plataforma.<br>
• Respeitar integralmente a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).<br>
• Agir com confidencialidade, ética profissional e responsabilidade.<br>
• Reportar imediatamente qualquer falha, violação de segurança ou acesso indevido.<br><br>

O uso inadequado de dados confidenciais poderá resultar em:<br>
• Revogação imediata do acesso administrativo;<br>
• Responsabilização civil e administrativa;<br>
• Ações legais, quando aplicável.<br><br>

<span class="titulo-item">4. Exclusão da Conta de Administrador</span><br>
Caso um Administrador deseje encerrar sua conta, o processo não é automático.<br>
A solicitação deverá ser enviada formalmente para:<br>
<b>administrativo.bitfolio@gmail.com</b><br><br>

Após a confirmação interna:<br>
• O acesso será revogado;<br>
• Os dados pessoais serão removidos do ambiente operacional;<br><br>

<span class="titulo-item">5. Limitações de Responsabilidade</span><br>
O Administrador reconhece que:<br>
• O BitFolio atua como intermediador tecnológico.<br>
• Métricas e dados exibidos possuem caráter informativo e podem depender de atualizações feitas pelos usuários.<br>
• A integridade e confidencialidade dos dados são priorizadas, mas nenhuma plataforma é totalmente imune a incidentes.<br><br>

<span class="titulo-header">II. DISPOSIÇÕES FINAIS</span><br><br>
O BitFolio pode atualizar este documento a qualquer momento, respeitando os princípios da transparência. <br>
O uso contínuo da plataforma após as atualizações implica aceitação automática das novas condições.<br>`,
    botaoTexto: 'Fechar'
  };

  this.dialog.open(TermosUsoComponent, config);
}


}

