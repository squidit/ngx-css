import { Component, Input, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SqModalService,
  SqDialogRef,
  SqModalBaseComponent,
  SqOverlayBaseComponent,
  confirmBeforeClose,
} from '@squidit/ngx-css';

/**
 * Componente de conteúdo simples para ser injetado no modal/overlay
 */
@Component({
  selector: 'app-modal-content',
  standalone: true,
  template: `
    <div class="modal-content-example">
      <h4>{{ title }}</h4>
      <p>{{ message }}</p>
      <p><strong>Contador:</strong> {{ counter }}</p>
      <div class="actions">
        <button class="button background-secondary" (click)="increment()">Incrementar</button>
        <button class="button background-primary" (click)="confirm()">Confirmar</button>
        <button class="button background-transparent" (click)="cancel()">Cancelar</button>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-content-example {
        padding: 1rem;
      }
      .actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
      }
    `,
  ],
})
export class ModalContentComponent {
  @Input() title = 'Título do Modal';
  @Input() message = 'Conteúdo do modal';
  @Input() dialogRef?: SqDialogRef;

  counter = 0;

  increment() {
    this.counter++;
  }

  confirm() {
    this.dialogRef?.close({ confirmed: true, counter: this.counter });
  }

  cancel() {
    this.dialogRef?.close({ confirmed: false });
  }
}

@Component({
  selector: 'app-modal-service-example',
  standalone: true,
  imports: [CommonModule, SqModalBaseComponent, SqOverlayBaseComponent],
  templateUrl: './modal-service-example.component.html',
  styleUrls: ['./modal-service-example.component.scss'],
})
export class ModalServiceExampleComponent {
  // Para uso declarativo
  isModalOpen = false;
  isOverlayOpen = false;

  // Para exibir resultados
  lastResult: any = null;

  // Template refs para exemplos com template
  @ViewChild('customHeader') customHeader!: TemplateRef<any>;
  @ViewChild('customBody') customBody!: TemplateRef<any>;
  @ViewChild('customFooter') customFooter!: TemplateRef<any>;

  private modalService = inject(SqModalService);

  // ============================================
  // Exemplos com Serviço (Programático)
  // ============================================

  openModalCustom() {
    this.modalService
      .openModal({
        size: 'xl',
        header: this.customHeader,
        footer: this.customFooter,
        body: this.customBody,
        data: {
          item: 'item 1',
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
      })
      .pipe(confirmBeforeClose(() => confirm('Deseja realmente fechar o modal?')))
      .subscribe(result => {
        console.log('Modal custom fechado com resultado:', result);
      });
  }

  multiplyData(modal: SqDialogRef, data: number[]) {
    modal.updateData({ data: data.map(n => n * 2) });
  }

  openModalWithComponent() {
    this.modalService
      .openModal({
        size: 'md',
        body: ModalContentComponent,
        data: {
          title: 'Modal via Serviço',
          message: 'Este modal foi aberto programaticamente usando SqModalService.',
        },
      })
      .subscribe(result => {
        this.lastResult = result;
        console.log('Modal fechado com resultado:', result);
      });
  }

  openOverlayWithComponent() {
    this.modalService
      .openOverlay({
        direction: 'right',
        width: '400px',
        body: ModalContentComponent,
        data: {
          title: 'Overlay via Serviço',
          message: 'Este overlay foi aberto programaticamente.',
        },
      })
      .subscribe(result => {
        this.lastResult = result;
        console.log('Overlay fechado com resultado:', result);
      });
  }

  openLargeModal() {
    this.modalService
      .openModal({
        size: 'lg',
        body: ModalContentComponent,
        data: {
          title: 'Modal Grande (lg)',
          message: 'Este é um modal com tamanho grande.',
        },
      })
      .subscribe(result => {
        this.lastResult = result;
      });
  }

  openSmallModal() {
    this.modalService
      .openModal({
        size: 'sm',
        body: ModalContentComponent,
        data: {
          title: 'Modal Pequeno (sm)',
          message: 'Este é um modal com tamanho pequeno.',
        },
      })
      .subscribe(result => {
        this.lastResult = result;
      });
  }

  openLeftOverlay() {
    this.modalService
      .openOverlay({
        direction: 'left',
        width: '350px',
        body: ModalContentComponent,
        data: {
          title: 'Overlay Esquerdo',
          message: 'Este overlay abre do lado esquerdo.',
        },
      })
      .subscribe(result => {
        this.lastResult = result;
      });
  }

  openModalClickOutside() {
    this.modalService
      .openModal({
        size: 'md',
        backdrop: true, // Fecha ao clicar fora
        body: ModalContentComponent,
        data: {
          title: 'Clique Fora para Fechar',
          message: 'Este modal fecha se você clicar fora dele.',
        },
      })
      .subscribe(result => {
        this.lastResult = result;
      });
  }

  // ============================================
  // Exemplos Declarativos (Template)
  // ============================================

  openDeclarativeModal() {
    this.isModalOpen = true;
  }

  closeDeclarativeModal() {
    this.isModalOpen = false;
    this.lastResult = { source: 'declarative-modal', closed: true };
  }

  openDeclarativeOverlay() {
    this.isOverlayOpen = true;
  }

  closeDeclarativeOverlay() {
    this.isOverlayOpen = false;
    this.lastResult = { source: 'declarative-overlay', closed: true };
  }
}
