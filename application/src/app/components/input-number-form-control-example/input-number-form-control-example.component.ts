import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SqInputNumberComponent } from '../../../../../src/components/sq-input-number/sq-input-number.component';
import { SqInputNumberFormControlComponent } from '../../../../../src/components/sq-input-number-form-control/sq-input-number-form-control.component';
import { SqValidationMessageComponent } from '../../../../../src/components/sq-validation-message/sq-validation-message.component';
import { SqValidationDirective } from '../../../../../src/directives/sq-validation.directive';
import { InputValidators } from '../../../../../src/validators/input.validators';
import { CodeTabsComponent, CodeExample } from '../code-tabs/code-tabs.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-input-number-form-control-example',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SqInputNumberComponent,
    SqInputNumberFormControlComponent,
    SqValidationMessageComponent,
    SqValidationDirective,
    CodeTabsComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './input-number-form-control-example.component.html',
  styleUrls: ['./input-number-form-control-example.component.scss'],
})
export class InputNumberFormControlExampleComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', route: '/components-index', icon: 'fas fa-home' },
    { label: 'Input Number Form Control', icon: 'fas fa-hashtag' },
  ];

  // Seção 1: Quantidade básica
  oldQuantityValue = 0;
  newQuantityControl = new FormControl<number>(0);

  // Seção 2: Com validação required
  oldRequiredValue = 0;
  newRequiredControl = new FormControl<number>(0, [Validators.required]);

  // Seção 3: Com valor mínimo
  oldMinValue = 0;
  newMinControl = new FormControl<number>(0, [InputValidators.minValue(10)]);

  // Seção 4: Números negativos permitidos
  oldNegativeValue = 0;
  newNegativeControl = new FormControl<number>(0);

  // Seção 5: Incremento customizado (Arrow Up/Down)
  newIncrementControl = new FormControl<number>(0);

  // Code Examples
  basicExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-number)',
      language: 'html',
      code: `<sq-input-number
  [label]="'Quantidade'"
  [(value)]="quantity"
  [name]="'quantity'"
></sq-input-number>`,
    },
    {
      label: 'Componente Novo (sq-input-number-form-control)',
      language: 'html',
      code: `<sq-input-number-form-control
  [label]="'Quantidade'"
  [formControl]="quantityControl"
></sq-input-number-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `quantityControl = new FormControl<number | null>(null);`,
    },
  ];

  requiredExampleCode: CodeExample[] = [
    {
      label: 'Componente Novo com Validação',
      language: 'html',
      code: `<sq-input-number-form-control
  [label]="'Quantidade *'"
  [formControl]="requiredControl"
></sq-input-number-form-control>

<sq-validation-message
  [control]="requiredControl"
  [fieldName]="'Quantidade'"
></sq-validation-message>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `requiredControl = new FormControl<number | null>(null, [Validators.required]);`,
    },
  ];

  minExampleCode: CodeExample[] = [
    {
      label: 'Componente Novo com Valor Mínimo',
      language: 'html',
      code: `<sq-input-number-form-control
  [label]="'Mínimo 10 unidades'"
  [formControl]="minControl"
  sqValidation
  [fieldName]="'Quantidade'"
></sq-input-number-form-control>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { InputValidators } from '@squidit/ngx-css';

minControl = new FormControl<number | null>(null, [InputValidators.minValue(10)]);`,
    },
  ];

  negativeExampleCode: CodeExample[] = [
    {
      label: 'Componente Novo com Números Negativos',
      language: 'html',
      code: `<sq-input-number-form-control
  [label]="'Saldo (pode ser negativo)'"
  [formControl]="negativeControl"
  [allowNegativeNumbers]="true"
></sq-input-number-form-control>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `negativeControl = new FormControl<number | null>(null);`,
    },
  ];

  incrementExampleCode: CodeExample[] = [
    {
      label: 'Componente Novo com Incremento Customizado',
      language: 'html',
      code: `<!-- Incrementa/decrementa de 10 em 10 com Arrow Up/Down -->
<sq-input-number-form-control
  [label]="'Quantidade (incremento de 10)'"
  [formControl]="incrementControl"
  [incrementValue]="10"
></sq-input-number-form-control>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `incrementControl = new FormControl<number | null>(null);

// Use as setas ↑ e ↓ do teclado para incrementar/decrementar`,
    },
  ];
}
