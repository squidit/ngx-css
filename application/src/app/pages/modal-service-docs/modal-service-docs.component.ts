import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqButtonComponent, SqModalManagerService } from '@squidit/ngx-css';
import { ModalExampleContentComponent } from '../../components/modal-example-content/modal-example-content.component';
import { OverlayExampleContentComponent } from '../../components/overlay-example-content/overlay-example-content.component';

@Component({
  selector: 'app-modal-service-docs',
  standalone: true,
  imports: [CommonModule, SqButtonComponent],
  templateUrl: './modal-service-docs.component.html',
  styleUrls: ['./modal-service-docs.component.scss'],
})
export class ModalServiceDocsComponent {
  constructor(private modalManager: SqModalManagerService) {}

  /**
   * Abre um modal centralizado com header e footer padrão
   */
  openModal() {
    const modalRef = this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'lg',
      backdrop: 'static',
      title: 'Início - Campanha Campanha teste Hub 8009',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Iniciar Campanha',
      data: {
        title: '🎯 Modal Dinâmico',
        message: 'Este modal foi criado dinamicamente usando SqModalManagerService!',
      },
    });

    // Escutar quando o modal fechar
    modalRef.afterClosed().subscribe((result) => {
      if (result?.confirmed) {
        console.log('✅ Modal confirmado!', result);
      } else {
        console.log('ℹ️ Modal cancelado');
      }
    });
  }

  /**
   * Abre um overlay lateral (direita) com header e footer padrão
   */
  openOverlay() {
    const modalRef = this.modalManager.open<any>(OverlayExampleContentComponent, {
      type: 'overlay',
      direction: 'right',
      width: '500px',
      backdrop: 'true',
      title: 'Configurações Avançadas',
      cancelButtonText: 'Fechar',
      confirmButtonText: 'Salvar',
      data: {
        title: '📱 Overlay Lateral',
        message: 'Este painel desliza da direita usando SqModalBaseComponent!',
      },
    });

    modalRef.afterClosed().subscribe((result) => {
      if (result?.confirmed) {
        console.log('✅ Overlay confirmado!', result);
      } else {
        console.log('ℹ️ Overlay cancelado');
      }
    });
  }

  /**
   * Abre modal com tamanho pequeno
   */
  openSmallModal() {
    const modalRef = this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'sm',
      backdrop: 'true', // Permite fechar clicando fora
      title: 'Confirmação',
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim',
      data: {
        title: '📦 Modal Pequeno',
        message: 'Modal com tamanho SM',
      },
    });
    
    modalRef.afterClosed().subscribe((result) => {
      console.log('Modal pequeno fechado:', result);
    });
  }

  /**
   * Abre modal fullscreen (quase tela inteira)
   */
  openFullscreenModal() {
    const modalRef = this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'fullscreen',
      backdrop: 'static',
      title: 'Modal Fullscreen - Visualização Completa',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Salvar Tudo',
      data: {
        title: '🖥️ Modal Fullscreen',
        message: 'Este modal ocupa quase toda a tela, ideal para visualizações complexas!',
      },
    });
    
    modalRef.afterClosed().subscribe((result) => {
      console.log('Modal fullscreen fechado:', result);
    });
  }

  /**
   * Abre overlay da esquerda
   */
  openLeftOverlay() {
    const modalRef = this.modalManager.open<any>(OverlayExampleContentComponent, {
      type: 'overlay',
      direction: 'left',
      width: '400px',
      backdrop: 'true',
      title: 'Filtros',
      cancelButtonText: 'Voltar',
      confirmButtonText: 'Aplicar',
      data: {
        title: '⬅️ Overlay Esquerda',
        message: 'Este painel desliza da esquerda!',
      },
    });

    modalRef.afterClosed().subscribe((result) => {
      console.log('Overlay esquerda fechado:', result);
    });
  }

  /**
   * Abre overlay de cima
   */
  openTopOverlay() {
    const modalRef = this.modalManager.open<any>(OverlayExampleContentComponent, {
      type: 'overlay',
      direction: 'top',
      width: '100%',
      backdrop: 'true',
      title: 'Notificações',
      cancelButtonText: 'Dispensar',
      confirmButtonText: 'Ver Todas',
      data: {
        title: '⬇️ Overlay Superior',
        message: 'Este painel desliza de cima para baixo!',
      },
    });

    modalRef.afterClosed().subscribe((result) => {
      console.log('Overlay superior fechado:', result);
    });
  }

  /**
   * Abre overlay de baixo
   */
  openBottomOverlay() {
    const modalRef = this.modalManager.open<any>(OverlayExampleContentComponent, {
      type: 'overlay',
      direction: 'bottom',
      width: '100%',
      backdrop: 'true',
      title: 'Ações Rápidas',
      cancelButtonText: 'Fechar',
      confirmButtonText: 'Confirmar',
      data: {
        title: '⬆️ Overlay Inferior',
        message: 'Este painel desliza de baixo para cima!',
      },
    });

    modalRef.afterClosed().subscribe((result) => {
      console.log('Overlay inferior fechado:', result);
    });
  }

  /**
   * Modal médio (padrão)
   */
  openMediumModal() {
    this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'md',
      title: 'Modal Médio',
      data: {
        title: '📦 Tamanho Médio',
        message: 'Modal padrão de 600px de largura.',
      },
    });
  }

  /**
   * Modal extra large
   */
  openExtraLargeModal() {
    this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'xl',
      title: 'Modal Extra Grande',
      data: {
        title: '📦 Extra Large',
        message: 'Modal de 1000px de largura para conteúdo extenso.',
      },
    });
  }

  /**
   * Modal com backdrop estático
   */
  openStaticModal() {
    this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'md',
      backdrop: 'static',
      title: 'Ação Importante',
      cancelButtonText: 'Não, Voltar',
      confirmButtonText: 'Sim, Continuar',
      data: {
        title: '🔒 Backdrop Estático',
        message: 'Este modal NÃO fecha ao clicar fora ou pressionar ESC. Use os botões!',
      },
    });
  }

  /**
   * Modal que fecha ao clicar fora
   */
  openDismissableModal() {
    this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'md',
      backdrop: 'true',
      title: 'Informação',
      data: {
        title: '🔓 Backdrop Dismissable',
        message: 'Você pode fechar este modal clicando fora dele ou pressionando ESC.',
      },
    });
  }

  /**
   * Modal com botões customizados
   */
  openCustomButtonsModal() {
    this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'md',
      title: 'Confirmar Exclusão',
      cancelButtonText: 'Não, Manter',
      confirmButtonText: 'Sim, Excluir',
      data: {
        title: '🗑️ Botões Customizados',
        message: 'Os textos dos botões foram personalizados para esta ação específica.',
      },
    });
  }

  /**
   * Modal sem footer
   */
  openNoFooterModal() {
    this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'md',
      title: 'Apenas Visualização',
      showFooterButtons: false,
      data: {
        title: '👁️ Sem Footer',
        message: 'Este modal não tem footer. Use o X no header para fechar.',
      },
    });
  }

  /**
   * Modal com dados específicos
   */
  openModalWithData() {
    const modalRef = this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'lg',
      title: 'Detalhes do Usuário',
      data: {
        title: '📦 Passando Dados',
        message: 'Estes dados foram passados via config.data',
        userId: 123,
        userName: 'João Silva',
        userEmail: 'joao@example.com',
      },
    });

    modalRef.afterClosed().subscribe((result) => {
      console.log('Dados retornados:', result);
    });
  }

  /**
   * Modal com atualização em tempo real
   */
  openModalWithLiveUpdate() {
    const modalRef = this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'md',
      title: 'Progresso em Tempo Real',
      showFooterButtons: false,
      data: {
        title: '🔄 Atualização Dinâmica',
        message: 'Contador: 0',
      },
    });

    // Atualizar o contador a cada segundo
    let count = 0;
    const interval = setInterval(() => {
      count++;
      modalRef.updateData({
        message: `Contador: ${count}`,
      });

      if (count >= 10) {
        clearInterval(interval);
        modalRef.updateData({
          message: `✅ Concluído! Total: ${count}`,
        });
        setTimeout(() => modalRef.close(), 1000);
      }
    }, 500);
  }

  /**
   * Modal com header customizado (placeholder - requer componente customizado)
   */
  openModalWithCustomHeader() {
    this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'md',
      title: '🎨 Header Customizado',
      data: {
        title: '🎨 Header Personalizado',
        message: 'Para headers totalmente customizados, crie um componente com ng-template #customHeader.',
      },
    });
  }

  /**
   * Modal com footer customizado (placeholder)
   */
  openModalWithCustomFooter() {
    this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'md',
      title: '🔧 Footer Customizado',
      data: {
        title: '🔧 Footer Personalizado',
        message: 'Para footers totalmente customizados, crie um componente com ng-template #customFooter.',
      },
    });
  }

  /**
   * Modal totalmente customizado (placeholder)
   */
  openModalFullyCustomized() {
    this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'lg',
      title: '✨ Totalmente Customizado',
      data: {
        title: '✨ Customização Total',
        message: 'Headers e footers customizados dão controle total sobre a aparência do modal.',
      },
    });
  }

  /**
   * Abrir múltiplos modais
   */
  openMultipleModals() {
    // Primeiro modal
    const modal1 = this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'sm',
      title: 'Primeiro Modal',
      data: {
        title: '1️⃣ Primeiro',
        message: 'Este é o primeiro modal.',
      },
    });

    // Segundo modal após 500ms
    setTimeout(() => {
      const modal2 = this.modalManager.open<any>(OverlayExampleContentComponent, {
        type: 'overlay',
        direction: 'right',
        title: 'Segundo Modal',
        data: {
          title: '2️⃣ Segundo',
          message: 'Este é o segundo modal (overlay).',
        },
      });

      console.log('Modais abertos:', this.modalManager.openModalsCount);
    }, 500);
  }

  /**
   * Modal com estilização customizada
   */
  openStyledModal() {
    this.modalManager.open<any>(ModalExampleContentComponent, {
      type: 'modal',
      size: 'md',
      title: 'Modal Estilizado',
      customClass: 'custom-styled-modal',
      headerBgColor: '#4CAF50',
      bodyBgColor: '#f9f9f9',
      footerBgColor: '#e0e0e0',
      headerPadding: '2rem',
      bodyPadding: '2rem',
      data: {
        title: '🎨 Estilização Custom',
        message: 'Este modal tem cores e espaçamentos customizados!',
      },
    });
  }
}

