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
}

