import { SqValidationDirective } from './../../../../../src/directives/sq-validation.directive';
import { SqTextareaFormControlComponent } from './../../../../../src/components/sq-textarea-form-control/sq-textarea-form-control.component';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { SqTextareaFormControlComponent, SqValidationDirective } from '@squidlib/ngx-css';
import { CodeTabsComponent } from '../code-tabs/code-tabs.component';

@Component({
  selector: 'app-textarea-form-control-example',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SqTextareaFormControlComponent,
    SqValidationDirective,
    CodeTabsComponent,
  ],
  templateUrl: './textarea-form-control-example.component.html',
  styleUrls: ['./textarea-form-control-example.component.scss'],
})
export class TextareaFormControlExampleComponent {
  // 1️⃣ Reactive Form com validações
  feedbackForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    description: new FormControl('', [Validators.required, Validators.minLength(20)]),
    suggestions: new FormControl(''),
  });

  // 2️⃣ FormControl individual com maxLength
  bioControl = new FormControl('', [Validators.maxLength(500)]);

  // 3️⃣ FormControl com autoResize
  notesControl = new FormControl('');

  // 4️⃣ FormControl desabilitado
  readonlyControl = new FormControl('Este conteúdo não pode ser editado. É apenas para visualização.');
  disabledControl = new FormControl({ value: 'Este campo está desabilitado', disabled: true });

  // Estado de eventos
  isFocused = false;
  lastValue = '';

  // Código para os tabs
  basicCode = `
<!-- Uso básico -->
<sq-textarea-form-control
  [label]="'Descrição'"
  [placeholder]="'Digite uma descrição...'"
  [formControl]="descriptionControl"
></sq-textarea-form-control>

<!-- Com Reactive Forms -->
<form [formGroup]="feedbackForm">
  <sq-textarea-form-control
    formControlName="description"
    [label]="'Descrição *'"
    [placeholder]="'Descreva seu feedback...'"
    [required]="true"
    [rows]="5"
  ></sq-textarea-form-control>
</form>`;

  // maxLength removido - validação deve ser feita via validators no FormControl
  // Exemplo: new FormControl('', [Validators.maxLength(500)])
  maxLengthCode = `
<!-- Validação de maxLength deve ser feita via validators no FormControl -->
<sq-textarea-form-control
  [label]="'Bio (máximo 500 caracteres)'"
  [placeholder]="'Conte um pouco sobre você...'"
  [formControl]="bioControl"
></sq-textarea-form-control>

<!-- No TypeScript: -->
<!-- bioControl = new FormControl('', [Validators.maxLength(500)]); -->`;

  autoResizeCode = `
<!-- Com auto-resize -->
<sq-textarea-form-control
  [label]="'Notas'"
  [placeholder]="'Digite suas notas...'"
  [formControl]="notesControl"
  [autoResize]="true"
  [minHeight]="'80px'"
  [maxHeight]="'400px'"
></sq-textarea-form-control>`;

  stylesCode = `
<!-- Estilos customizados -->
<sq-textarea-form-control
  [label]="'Campo Verde'"
  [placeholder]="'Fundo verde'"
  [backgroundColor]="'#e8f5e9'"
  [borderColor]="'#4caf50'"
  [labelColor]="'#388e3c'"
></sq-textarea-form-control>

<!-- Com tooltip -->
<sq-textarea-form-control
  [label]="'Com Tooltip'"
  [tooltipMessage]="'Dica adicional sobre este campo'"
  [tooltipIcon]="'fa-solid fa-circle-info'"
></sq-textarea-form-control>`;

  statesCode = `
<!-- Desabilitado -->
<sq-textarea-form-control
  [label]="'Campo Desabilitado'"
  [disabled]="true"
  [formControl]="disabledControl"
></sq-textarea-form-control>

<!-- Somente leitura -->
<sq-textarea-form-control
  [label]="'Somente Leitura'"
  [readonly]="true"
  [formControl]="readonlyControl"
></sq-textarea-form-control>`;

  eventsCode = `
<!-- Com eventos -->
<sq-textarea-form-control
  [label]="'Campo com Eventos'"
  [placeholder]="'Digite algo...'"
  (focused)="onFocus($event)"
  (blurred)="onBlur($event)"
></sq-textarea-form-control>`;

  constructor() {
    // Observa mudanças no campo bio
    this.bioControl.valueChanges.subscribe(value => {
      console.log('Bio changed:', value?.length, 'caracteres');
    });
  }

  onSubmit() {
    if (this.feedbackForm.valid) {
      console.log('Form submitted:', this.feedbackForm.value);
      alert('Formulário enviado com sucesso! Veja o console para os valores.');
    } else {
      console.log('Form is invalid');
      alert('Por favor, preencha todos os campos corretamente.');
      this.markFormGroupTouched(this.feedbackForm);
    }
  }

  onReset() {
    this.feedbackForm.reset();
    this.bioControl.reset();
    this.notesControl.reset();
  }

  onFocus(_event: FocusEvent) {
    this.isFocused = true;
  }

  onBlur(_event: FocusEvent) {
    this.isFocused = false;
  }

  fillWithExample() {
    this.feedbackForm.patchValue({
      title: 'Sugestão de Melhoria',
      description:
        'Gostaria de sugerir uma melhoria no sistema de notificações. Seria interessante ter a opção de configurar horários específicos para receber alertas.',
      suggestions: 'Adicionar filtros avançados e opção de exportar relatórios em PDF.',
    });
    this.bioControl.setValue(
      'Desenvolvedor Full Stack com 5 anos de experiência em Angular, React e Node.js. Apaixonado por criar interfaces intuitivas e performáticas.'
    );
    this.notesControl.setValue('Lembrar de revisar a documentação do projeto antes da reunião de sexta-feira.');
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
