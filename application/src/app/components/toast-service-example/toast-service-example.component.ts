import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SqToastService, SqToastRef, SqToastPosition, ToastHelper } from '@squidlib/ngx-css';

@Component({
  selector: 'app-toast-service-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './toast-service-example.component.html',
  styleUrls: ['./toast-service-example.component.scss'],
})
export class ToastServiceExampleComponent {
  // Services
  private toastService = inject(SqToastService);
  private toastHelper = inject(ToastHelper);

  // Configuration
  selectedPosition: SqToastPosition = 'top-right';
  selectedDuration = 5000;
  customMessage = 'Esta é uma mensagem de toast!';

  // State
  activeToastRef?: SqToastRef;
  lastDismissReason?: string;
  toastHistory: Array<{ message: string; type: string; timestamp: Date }> = [];

  // Position options
  positions: SqToastPosition[] = [
    'top-right',
    'top-left',
    'top-center',
    'top-full',
    'bottom-right',
    'bottom-left',
    'bottom-center',
    'bottom-full',
  ];

  // ============================================
  // NOVO: SqToastService (Recomendado)
  // ============================================

  showSuccess() {
    const ref = this.toastService.success('Operação realizada com sucesso!', {
      position: this.selectedPosition,
      duration: this.selectedDuration,
      dataTest: 'toast-success-example',
    });

    this.trackToast(ref, 'success', 'Operação realizada com sucesso!');
  }

  showError() {
    const ref = this.toastService.error('Ocorreu um erro ao processar sua solicitação.', {
      position: this.selectedPosition,
      duration: this.selectedDuration,
      dataTest: 'toast-error-example',
    });

    this.trackToast(ref, 'error', 'Ocorreu um erro ao processar sua solicitação.');
  }

  showWarning() {
    const ref = this.toastService.warning('Atenção: Esta ação não pode ser desfeita.', {
      position: this.selectedPosition,
      duration: this.selectedDuration,
      dataTest: 'toast-warning-example',
    });

    this.trackToast(ref, 'warning', 'Atenção: Esta ação não pode ser desfeita.');
  }

  showInfo() {
    const ref = this.toastService.info('Dica: Você pode clicar aqui para mais informações.', {
      position: this.selectedPosition,
      duration: this.selectedDuration,
      dataTest: 'toast-info-example',
    });

    this.trackToast(ref, 'info', 'Dica: Você pode clicar aqui para mais informações.');
  }

  showDefault() {
    const ref = this.toastService.default('Notificação padrão', {
      position: this.selectedPosition,
      duration: this.selectedDuration,
      dataTest: 'toast-default-example',
    });

    this.trackToast(ref, 'default', 'Notificação padrão');
  }

  showCustomMessage() {
    const ref = this.toastService.info(this.customMessage, {
      position: this.selectedPosition,
      duration: this.selectedDuration,
    });

    this.trackToast(ref, 'custom', this.customMessage);
  }

  // ============================================
  // Exemplos Avançados
  // ============================================

  showWithAction() {
    const ref = this.toastService.success('Item removido da lista', {
      position: this.selectedPosition,
      duration: 8000,
      action: {
        label: 'Desfazer',
        callback: () => {
          this.toastService.info('Ação desfeita!', { duration: 3000 });
        },
      },
      dataTest: 'toast-with-action',
    });

    this.trackToast(ref, 'success', 'Item removido da lista (com ação)');
  }

  showPersistent() {
    const ref = this.toastService.warning('Este toast não fecha automaticamente', {
      position: this.selectedPosition,
      duration: 0, // Persistente
      dataTest: 'toast-persistent',
    });

    this.activeToastRef = ref;
    this.trackToast(ref, 'warning', 'Toast persistente');
  }

  showWithObservable() {
    const ref = this.toastService.info('Feche este toast e veja o motivo no console', {
      position: this.selectedPosition,
      duration: this.selectedDuration,
      dataTest: 'toast-observable',
    });

    ref.afterDismissed().subscribe(reason => {
      this.lastDismissReason = reason;
      console.log('Toast fechado por:', reason);
    });

    this.trackToast(ref, 'info', 'Toast com Observable');
  }

  showCloseable() {
    const ref = this.toastService.info('Este toast pode ser fechado manualmente', {
      position: this.selectedPosition,
      duration: this.selectedDuration,
      closeable: true,
      dataTest: 'toast-closeable',
    });

    this.trackToast(ref, 'info', 'Com botão de fechar');
  }

  showDismissOnClick() {
    const ref = this.toastService.info('Clique em mim para fechar!', {
      position: this.selectedPosition,
      duration: 0,
      dismissOnClick: true,
      dataTest: 'toast-click-dismiss',
    });

    this.trackToast(ref, 'info', 'Clique para fechar');
  }

  showNoIcon() {
    const ref = this.toastService.info('Toast sem ícone', {
      position: this.selectedPosition,
      duration: this.selectedDuration,
      showIcon: false,
      dataTest: 'toast-no-icon',
    });

    this.trackToast(ref, 'info', 'Sem ícone');
  }

  showCustomIcon() {
    const ref = this.toastService.default('Toast com ícone customizado', {
      position: this.selectedPosition,
      duration: this.selectedDuration,
      icon: 'fa-solid fa-rocket',
      dataTest: 'toast-custom-icon',
    });

    this.trackToast(ref, 'default', 'Ícone customizado');
  }

  showMultiple() {
    this.toastService.success('Primeiro toast', { position: this.selectedPosition });
    setTimeout(() => {
      this.toastService.info('Segundo toast', { position: this.selectedPosition });
    }, 300);
    setTimeout(() => {
      this.toastService.warning('Terceiro toast', { position: this.selectedPosition });
    }, 600);
  }

  dismissActive() {
    if (this.activeToastRef) {
      this.activeToastRef.dismiss();
      this.activeToastRef = undefined;
    }
  }

  dismissAll() {
    this.toastService.dismissAll();
    this.activeToastRef = undefined;
  }

  // ============================================
  // ANTIGO: ToastHelper (Deprecated)
  // ============================================

  legacySuccess() {
    // ⚠️ Depende de window.Toast global
    // ⚠️ Não mockável em testes
    // ⚠️ Sem data-test attributes
    // ⚠️ Sem Observable para lifecycle
    this.toastHelper.toast.success('Toast via ToastHelper (deprecated)', {
      duration: this.selectedDuration,
    });
  }

  legacyError() {
    this.toastHelper.toast.error('Erro via ToastHelper (deprecated)', {
      duration: this.selectedDuration,
    });
  }

  legacyWarning() {
    this.toastHelper.toast.warning('Warning via ToastHelper (deprecated)', {
      duration: this.selectedDuration,
    });
  }

  legacyInfo() {
    this.toastHelper.toast.info('Info via ToastHelper (deprecated)', {
      duration: this.selectedDuration,
    });
  }

  // ============================================
  // Helpers
  // ============================================

  private trackToast(ref: SqToastRef, type: string, message: string) {
    this.toastHistory.unshift({
      message,
      type,
      timestamp: new Date(),
    });

    // Keep only last 10
    if (this.toastHistory.length > 10) {
      this.toastHistory.pop();
    }

    // Track dismiss
    ref.afterDismissed().subscribe(reason => {
      this.lastDismissReason = reason;
    });
  }

  clearHistory() {
    this.toastHistory = [];
    this.lastDismissReason = undefined;
  }

  getActiveCount(): number {
    return this.toastService.getActiveCount();
  }
}
