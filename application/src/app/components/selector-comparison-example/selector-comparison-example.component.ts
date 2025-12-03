import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SqSelectorComponent } from '../../../../../src/components/sq-selector/sq-selector.component';
import { SqSelectorFormControlComponent } from '../../../../../src/components/sq-selector-form-control/sq-selector-form-control.component';
import { SqValidationMessageComponent } from '../../../../../src/components/sq-validation-message/sq-validation-message.component';
import { SqValidationDirective } from '../../../../../src/directives/sq-validation.directive';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { CodeTabsComponent, CodeExample } from '../code-tabs/code-tabs.component';

@Component({
  selector: 'app-selector-comparison-example',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SqSelectorComponent,
    SqSelectorFormControlComponent,
    SqValidationMessageComponent,
    SqValidationDirective,
    BreadcrumbComponent,
    CodeTabsComponent,
  ],
  templateUrl: './selector-comparison-example.component.html',
  styleUrls: ['./selector-comparison-example.component.scss'],
})
export class SelectorComparisonExampleComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', route: '/components-index', icon: 'fas fa-home' },
    { label: 'Comparação de Seletores', icon: 'fas fa-check-square' },
  ];

  // ===== SEÇÃO 1: Checkbox Simples =====
  oldSimpleChecked = false;
  newSimpleControl = new FormControl(false);

  // ===== SEÇÃO 2: Checkbox Obrigatório =====
  oldRequiredChecked = false;
  newRequiredControl = new FormControl(false, [Validators.requiredTrue]);
  directiveRequiredControl = new FormControl(false, [Validators.requiredTrue]);

  // ===== SEÇÃO 3: Toggle =====
  oldToggleChecked = true;
  newToggleControl = new FormControl(true);

  // ===== SEÇÃO 4: Radio Buttons =====
  oldRadioValue = '';
  newRadioControl = new FormControl('', [Validators.required]);
  directiveRadioControl = new FormControl('', [Validators.required]);

  // ===== SEÇÃO 5: Checkbox com Cores Customizadas =====
  oldColorChecked = false;
  newColorControl = new FormControl(false);

  // ===== SEÇÃO 6: Múltiplos Checkboxes (FormGroup) =====
  oldPermissions = {
    read: false,
    write: false,
    delete: false,
  };

  newPermissionsForm = new FormGroup({
    read: new FormControl(false),
    write: new FormControl(false),
    delete: new FormControl(false),
  });

  // ===== SEÇÃO 7: Estado Indeterminado =====
  oldIndeterminateChecked = false;
  oldIndeterminate = true;
  newIndeterminateControl = new FormControl(false);
  newIndeterminate = true;

  // Code Examples
  simpleCheckboxExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-selector)',
      language: 'html',
      code: `<!-- HTML -->
<sq-selector
  [label]="'Aceito os termos e condições'"
  [type]="'checkbox'"
  [checked]="oldSimpleChecked"
  (valueChange)="oldSimpleChecked = $event.checked"
></sq-selector>`,
    },
    {
      label: 'TypeScript (Antigo)',
      language: 'typescript',
      code: `oldSimpleChecked = false;`,
    },
    {
      label: 'Componente Novo (sq-selector-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-selector-form-control
  [label]="'Aceito os termos e condições'"
  [type]="'checkbox'"
  [formControl]="newSimpleControl"
></sq-selector-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newSimpleControl = new FormControl(false);`,
    },
  ];

  requiredCheckboxExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-selector)',
      language: 'html',
      code: `<!-- HTML -->
<sq-selector
  [label]="'Aceito a política de privacidade *'"
  [type]="'checkbox'"
  [checked]="oldRequiredChecked"
  [required]="true"
  [errorSpan]="true"
  (valueChange)="oldRequiredChecked = $event.checked"
></sq-selector>`,
    },
    {
      label: 'TypeScript (Antigo)',
      language: 'typescript',
      code: `oldRequiredChecked = false;`,
    },
    {
      label: 'Componente Novo (sq-selector-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-selector-form-control
  [label]="'Aceito a política de privacidade *'"
  [type]="'checkbox'"
  [formControl]="newRequiredControl"
></sq-selector-form-control>

<sq-validation-message
  [control]="newRequiredControl"
  [fieldName]="'Política de Privacidade'"
  [showWhenTouched]="true"
></sq-validation-message>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newRequiredControl = new FormControl(false, [Validators.requiredTrue]);`,
    },
    {
      label: 'Com sqValidation Directive (Mais Simples)',
      language: 'html',
      code: `<!-- HTML - Validação automática -->
<sq-selector-form-control
  [label]="'Aceito a política de privacidade *'"
  [type]="'checkbox'"
  [formControl]="directiveRequiredControl"
  sqValidation
  [fieldName]="'Política de Privacidade'"
  [customErrorMessages]="{
    required: 'Você deve aceitar para continuar'
  }"
></sq-selector-form-control>`,
    },
    {
      label: 'TypeScript (Com Directive)',
      language: 'typescript',
      code: `directiveRequiredControl = new FormControl(false, [Validators.requiredTrue]);`,
    },
  ];

  toggleExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-selector)',
      language: 'html',
      code: `<!-- HTML -->
<sq-selector
  [label]="'Receber notificações por email'"
  [type]="'checkbox'"
  [toggle]="true"
  [checked]="oldToggleChecked"
  (valueChange)="oldToggleChecked = $event.checked"
></sq-selector>`,
    },
    {
      label: 'TypeScript (Antigo)',
      language: 'typescript',
      code: `oldToggleChecked = true;`,
    },
    {
      label: 'Componente Novo (sq-selector-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-selector-form-control
  [label]="'Receber notificações por email'"
  [toggle]="true"
  [formControl]="newToggleControl"
></sq-selector-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newToggleControl = new FormControl(true);`,
    },
  ];

  radioButtonsExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-selector)',
      language: 'html',
      code: `<!-- HTML -->
<div class="radio-group">
  <sq-selector
    [label]="'Cartão de Crédito'"
    [type]="'radio'"
    [name]="'payment'"
    [value]="'credit_card'"
    [checked]="oldRadioValue === 'credit_card'"
    [required]="true"
    (valueChange)="oldRadioValue = $event.value"
  ></sq-selector>

  <sq-selector
    [label]="'Boleto Bancário'"
    [type]="'radio'"
    [name]="'payment'"
    [value]="'boleto'"
    [checked]="oldRadioValue === 'boleto'"
    [required]="true"
    (valueChange)="oldRadioValue = $event.value"
  ></sq-selector>

  <sq-selector
    [label]="'PIX'"
    [type]="'radio'"
    [name]="'payment'"
    [value]="'pix'"
    [checked]="oldRadioValue === 'pix'"
    [required]="true"
    (valueChange)="oldRadioValue = $event.value"
  ></sq-selector>
</div>`,
    },
    {
      label: 'TypeScript (Antigo)',
      language: 'typescript',
      code: `oldRadioValue = '';`,
    },
    {
      label: 'Componente Novo (sq-selector-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<div class="radio-group">
  <sq-selector-form-control
    [label]="'Cartão de Crédito'"
    [type]="'radio'"
    [name]="'payment-new'"
    [value]="'credit_card'"
    [formControl]="newRadioControl"
  ></sq-selector-form-control>

  <sq-selector-form-control
    [label]="'Boleto Bancário'"
    [type]="'radio'"
    [name]="'payment-new'"
    [value]="'boleto'"
    [formControl]="newRadioControl"
  ></sq-selector-form-control>

  <sq-selector-form-control
    [label]="'PIX'"
    [type]="'radio'"
    [name]="'payment-new'"
    [value]="'pix'"
    [formControl]="newRadioControl"
  ></sq-selector-form-control>
</div>

<sq-validation-message
  [control]="newRadioControl"
  [fieldName]="'Forma de Pagamento'"
  [showWhenTouched]="true"
></sq-validation-message>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newRadioControl = new FormControl('', [Validators.required]);`,
    },
    {
      label: 'Com sqValidation Directive',
      language: 'html',
      code: `<!-- HTML - Validação automática -->
<div class="radio-group">
  <sq-selector-form-control
    [label]="'Cartão de Crédito'"
    [type]="'radio'"
    [name]="'payment-directive'"
    [value]="'credit_card'"
    [formControl]="directiveRadioControl"
  ></sq-selector-form-control>

  <sq-selector-form-control
    [label]="'Boleto Bancário'"
    [type]="'radio'"
    [name]="'payment-directive'"
    [value]="'boleto'"
    [formControl]="directiveRadioControl"
    sqValidation
    [fieldName]="'Forma de Pagamento'"
  ></sq-selector-form-control>

  <sq-selector-form-control
    [label]="'PIX'"
    [type]="'radio'"
    [name]="'payment-directive'"
    [value]="'pix'"
    [formControl]="directiveRadioControl"
  ></sq-selector-form-control>
</div>

<small class="text-info d-block mt-2">
  💡 sqValidation aplicado apenas no segundo radio
</small>`,
    },
  ];

  customColorExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-selector)',
      language: 'html',
      code: `<!-- HTML -->
<sq-selector
  [label]="'Modo Escuro'"
  [type]="'checkbox'"
  [checked]="oldColorChecked"
  [colorBackground]="'purple'"
  [toggle]="true"
  (valueChange)="oldColorChecked = $event.checked"
></sq-selector>`,
    },
    {
      label: 'Componente Novo (sq-selector-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-selector-form-control
  [label]="'Modo Escuro'"
  [type]="'checkbox'"
  [formControl]="newColorControl"
  [colorBackground]="'purple'"
  [toggle]="true"
></sq-selector-form-control>`,
    },
  ];

  multipleCheckboxesExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-selector)',
      language: 'html',
      code: `<!-- HTML -->
<div>
  <sq-selector
    [label]="'Leitura'"
    [type]="'checkbox'"
    [checked]="oldPermissions.read"
    (valueChange)="oldPermissions.read = $event.checked"
  ></sq-selector>

  <sq-selector
    [label]="'Escrita'"
    [type]="'checkbox'"
    [checked]="oldPermissions.write"
    (valueChange)="oldPermissions.write = $event.checked"
  ></sq-selector>

  <sq-selector
    [label]="'Exclusão'"
    [type]="'checkbox'"
    [checked]="oldPermissions.delete"
    (valueChange)="oldPermissions.delete = $event.checked"
  ></sq-selector>
</div>`,
    },
    {
      label: 'TypeScript (Antigo)',
      language: 'typescript',
      code: `oldPermissions = {
  read: false,
  write: false,
  delete: false,
};`,
    },
    {
      label: 'Componente Novo (sq-selector-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<form [formGroup]="newPermissionsForm">
  <sq-selector-form-control
    [label]="'Leitura'"
    [type]="'checkbox'"
    formControlName="read"
  ></sq-selector-form-control>

  <sq-selector-form-control
    [label]="'Escrita'"
    [type]="'checkbox'"
    formControlName="write"
  ></sq-selector-form-control>

  <sq-selector-form-control
    [label]="'Exclusão'"
    [type]="'checkbox'"
    formControlName="delete"
  ></sq-selector-form-control>
</form>

<div class="mt-3">
  <strong>Estado do FormGroup:</strong>
  <pre>{{ newPermissionsForm.value | json }}</pre>
</div>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newPermissionsForm = new FormGroup({
  read: new FormControl(false),
  write: new FormControl(false),
  delete: new FormControl(false),
});`,
    },
  ];

  indeterminateExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-selector)',
      language: 'html',
      code: `<!-- HTML -->
<sq-selector
  [label]="'Selecionar todos'"
  [type]="'checkbox'"
  [checked]="oldIndeterminateChecked"
  [indeterminate]="oldIndeterminate"
  (valueChange)="handleOldIndeterminate($event)"
></sq-selector>`,
    },
    {
      label: 'TypeScript (Antigo)',
      language: 'typescript',
      code: `oldIndeterminateChecked = false;
oldIndeterminate = true;

handleOldIndeterminate(event: any) {
  this.oldIndeterminateChecked = event.checked;
  this.oldIndeterminate = false;
}`,
    },
    {
      label: 'Componente Novo (sq-selector-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-selector-form-control
  [label]="'Selecionar todos'"
  [type]="'checkbox'"
  [formControl]="newIndeterminateControl"
  [indeterminate]="newIndeterminate"
></sq-selector-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newIndeterminateControl = new FormControl(false);
newIndeterminate = true;

constructor() {
  this.newIndeterminateControl.valueChanges.subscribe(() => {
    this.newIndeterminate = false;
  });
}`,
    },
  ];

  constructor() {
    // Subscrever mudanças no controle indeterminado
    this.newIndeterminateControl.valueChanges.subscribe(() => {
      this.newIndeterminate = false;
    });
  }

  handleOldIndeterminate(event: any) {
    this.oldIndeterminateChecked = event.checked;
    this.oldIndeterminate = false;
  }
}
