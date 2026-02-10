import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SqDialogRef } from '../../interfaces/modal.interface';

/**
 * Componente de exemplo para usar como body em openModal/openOverlay.
 * Demonstra o uso de @Input() (dados) e @Output() (handlers via config.outputs).
 *
 * @example
 * ```typescript
 * this.modalService.openModal({
 *   body: ModalExampleBodyComponent,
 *   data: { title: 'Confirmar ação' },
 *   outputs: {
 *     save: (value) => this.onSave(value),
 *     cancel: () => ref.close(),
 *   },
 * });
 * ```
 */
@Component({
  selector: 'sq-modal-example-body',
  standalone: true,
  template: `
    <div class="modal-example-body">
      @if (title) {
        <p class="modal-example-body__title">{{ title }}</p>
      }
      <div class="modal-example-body__actions">
        <button type="button" data-testid="modal-example-save" (click)="save.emit(payload)">Salvar</button>
        <button type="button" data-testid="modal-example-cancel" (click)="cancel.emit()">Cancelar</button>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-example-body__actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
      }
    `,
  ],
})
export class ModalExampleBodyComponent implements OnChanges {
  /** Título exibido no body (passado via data no config). */
  @Input() title = '';

  /** Referência do dialog (injetada pelo modal quando o componente aceita). */
  @Input() dialogRef?: SqDialogRef<any, any>;

  /** Emitido ao clicar em Salvar. Conectado via config.outputs.save. */
  @Output() save = new EventEmitter<{ id: number; label: string }>();

  /** Emitido ao clicar em Cancelar. Conectado via config.outputs.cancel. */
  @Output() cancel = new EventEmitter<void>();

  /** Payload de exemplo enviado no save. */
  readonly payload = { id: 1, label: 'exemplo' };

  /**
   * Ciclo de vida Angular: chamado quando um ou mais inputs mudam.
   * Disparado ao usar ref.updateData() e setInput no body.
   *
   * @param changes - Objeto com as mudanças dos inputs (currentValue, previousValue, firstChange)
   */
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
