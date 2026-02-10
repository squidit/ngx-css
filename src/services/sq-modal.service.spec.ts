import { ApplicationRef, Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SqModalService } from './sq-modal.service';
import { ModalExampleBodyComponent } from './examples/modal-example-body.component';

/**
 * Componente host que abre o modal com o body de exemplo e outputs.
 * Usado nos testes para ter um contexto de injeção e disparar change detection.
 */
@Component({
  selector: 'sq-modal-test-host',
  standalone: true,
  template: '',
})
class ModalTestHostComponent {
  readonly modalService = inject(SqModalService);
  readonly appRef = inject(ApplicationRef);

  openModalWithOutputs(outputs: { save: (v: any) => void; cancel: () => void }) {
    return this.modalService.openModal({
      size: 'md',
      body: ModalExampleBodyComponent,
      data: { title: 'Teste' },
      outputs,
    });
  }
}

describe('SqModalService (outputs)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ModalTestHostComponent],
      providers: [SqModalService],
    });
  });

  afterEach(() => {
    TestBed.inject(SqModalService).closeAll();
  });

  it('deve chamar o handler do output "save" quando o body emite save', () => {
    const saveSpy = jasmine.createSpy('save');
    const cancelSpy = jasmine.createSpy('cancel');

    const fixture = TestBed.createComponent(ModalTestHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.openModalWithOutputs({
      save: saveSpy,
      cancel: cancelSpy,
    });

    fixture.detectChanges();
    fixture.componentInstance.appRef.tick();

    const saveButton = document.querySelector<HTMLButtonElement>('[data-testid="modal-example-save"]');
    expect(saveButton).toBeTruthy();
    saveButton!.click();
    fixture.detectChanges();

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith({ id: 1, label: 'exemplo' });
    expect(cancelSpy).not.toHaveBeenCalled();
  });

  it('deve chamar o handler do output "cancel" quando o body emite cancel', () => {
    const saveSpy = jasmine.createSpy('save');
    const cancelSpy = jasmine.createSpy('cancel');

    const fixture = TestBed.createComponent(ModalTestHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.openModalWithOutputs({
      save: saveSpy,
      cancel: cancelSpy,
    });

    fixture.detectChanges();
    fixture.componentInstance.appRef.tick();

    const cancelButton = document.querySelector<HTMLButtonElement>('[data-testid="modal-example-cancel"]');
    expect(cancelButton).toBeTruthy();
    cancelButton!.click();
    fixture.detectChanges();

    expect(cancelSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('deve abrir overlay com outputs da mesma forma que modal', () => {
    const saveSpy = jasmine.createSpy('save');

    const fixture = TestBed.createComponent(ModalTestHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.modalService.openOverlay({
      body: ModalExampleBodyComponent,
      data: { title: 'Overlay' },
      outputs: { save: saveSpy },
    });

    fixture.detectChanges();
    fixture.componentInstance.appRef.tick();

    const saveButton = document.querySelector<HTMLButtonElement>('[data-testid="modal-example-save"]');
    expect(saveButton).toBeTruthy();
    saveButton!.click();
    fixture.detectChanges();

    expect(saveSpy).toHaveBeenCalledWith({ id: 1, label: 'exemplo' });
  });
});
