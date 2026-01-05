import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SqInputMaskComponent } from '../../../../../src/components/sq-input-mask/sq-input-mask.component';
import { SqInputMaskFormControlComponent } from '../../../../../src/components/sq-input-mask-form-control/sq-input-mask-form-control.component';
import { SqValidationDirective } from '../../../../../src/directives/sq-validation.directive';
import { CodeTabsComponent, CodeExample } from '../code-tabs/code-tabs.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-input-mask-form-control-example',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SqInputMaskComponent,
    SqInputMaskFormControlComponent,
    SqValidationDirective,
    CodeTabsComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './input-mask-form-control-example.component.html',
  styleUrls: ['./input-mask-form-control-example.component.scss'],
})
export class InputMaskFormControlExampleComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', route: '/components-index', icon: 'fas fa-home' },
    { label: 'Input Mask Form Control', icon: 'fas fa-keyboard' },
  ];

  // ========== Seção 1: Telefone ==========
  oldPhoneValue = '';
  newPhoneControl = new FormControl('');

  // ========== Seção 2: CPF ==========
  oldCpfValue = '';
  newCpfControl = new FormControl('', [Validators.required]);

  // ========== Seção 3: CEP ==========
  oldCepValue = '';
  newCepControl = new FormControl('');

  // ========== Seção 4: Data ==========
  oldDateValue = '';
  newDateControl = new FormControl('');

  // ========== Seção 5: Valor Monetário ==========
  oldMoneyValue = '';
  newMoneyControl = new FormControl('');

  // ========== Seção 6: CNPJ ==========
  oldCnpjValue = '';
  newCnpjControl = new FormControl('', [Validators.required]);

  // ========== Seção 7: Placa de Veículo ==========
  oldPlateValue = '';
  newPlateControl = new FormControl('');

  // ========== Seção 8: Cartão de Crédito ==========
  oldCardValue = '';
  newCardControl = new FormControl('');

  // Code Examples
  phoneExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-mask)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask
  [label]="'Telefone'"
  [mask]="'(00) 00000-0000'"
  [(value)]="oldPhoneValue"
  [name]="'phone'"
></sq-input-mask>`,
    },
    {
      label: 'TypeScript (Antigo)',
      language: 'typescript',
      code: `oldPhoneValue = '';`,
    },
    {
      label: 'Componente Novo (sq-input-mask-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask-form-control
  [label]="'Telefone'"
  [mask]="'(00) 00000-0000'"
  [formControl]="newPhoneControl"
  [placeholder]="'(00) 00000-0000'"
></sq-input-mask-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newPhoneControl = new FormControl('');`,
    },
  ];

  cpfExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-mask)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask
  [label]="'CPF *'"
  [mask]="'000.000.000-00'"
  [(value)]="oldCpfValue"
  [name]="'cpf'"
  [required]="true"
></sq-input-mask>`,
    },
    {
      label: 'Componente Novo (sq-input-mask-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask-form-control
  [label]="'CPF *'"
  [mask]="'000.000.000-00'"
  [formControl]="newCpfControl"
  [placeholder]="'000.000.000-00'"
></sq-input-mask-form-control>

<sq-validation-message
  [control]="newCpfControl"
  [fieldName]="'CPF'"
  [showWhenTouched]="true"
></sq-validation-message>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newCpfControl = new FormControl('', [Validators.required]);`,
    },
  ];

  cepExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-mask)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask
  [label]="'CEP'"
  [mask]="'00000-000'"
  [(value)]="oldCepValue"
  [name]="'cep'"
></sq-input-mask>`,
    },
    {
      label: 'Componente Novo (sq-input-mask-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask-form-control
  [label]="'CEP'"
  [mask]="'00000-000'"
  [formControl]="newCepControl"
  [placeholder]="'00000-000'"
></sq-input-mask-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newCepControl = new FormControl('');`,
    },
  ];

  dateExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-mask)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask
  [label]="'Data'"
  [mask]="'00/00/0000'"
  [(value)]="oldDateValue"
  [name]="'date'"
></sq-input-mask>`,
    },
    {
      label: 'Componente Novo (sq-input-mask-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask-form-control
  [label]="'Data'"
  [mask]="'00/00/0000'"
  [formControl]="newDateControl"
  [placeholder]="'dd/mm/aaaa'"
></sq-input-mask-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newDateControl = new FormControl('');`,
    },
  ];

  moneyExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-mask)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask
  [label]="'Valor'"
  [mask]="'separator.2'"
  [thousandSeparator]="'.'"
  [prefix]="'R$ '"
  [(value)]="oldMoneyValue"
  [name]="'money'"
></sq-input-mask>`,
    },
    {
      label: 'Componente Novo (sq-input-mask-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask-form-control
  [label]="'Valor'"
  [mask]="'separator.2'"
  [thousandSeparator]="'.'"
  [prefix]="'R$ '"
  [formControl]="newMoneyControl"
  [placeholder]="'0,00'"
></sq-input-mask-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newMoneyControl = new FormControl('');`,
    },
  ];

  cnpjExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-mask)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask
  [label]="'CNPJ *'"
  [mask]="'00.000.000/0000-00'"
  [(value)]="oldCnpjValue"
  [name]="'cnpj'"
  [required]="true"
></sq-input-mask>`,
    },
    {
      label: 'Componente Novo (sq-input-mask-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask-form-control
  [label]="'CNPJ *'"
  [mask]="'00.000.000/0000-00'"
  [formControl]="newCnpjControl"
  [placeholder]="'00.000.000/0000-00'"
  sqValidation
  [fieldName]="'CNPJ'"
></sq-input-mask-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newCnpjControl = new FormControl('', [Validators.required]);`,
    },
  ];

  plateExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-mask)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask
  [label]="'Placa do Veículo'"
  [mask]="'SSS-0*00'"
  [(value)]="oldPlateValue"
  [name]="'plate'"
></sq-input-mask>`,
    },
    {
      label: 'Componente Novo (sq-input-mask-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask-form-control
  [label]="'Placa do Veículo'"
  [mask]="'SSS-0*00'"
  [formControl]="newPlateControl"
  [placeholder]="'ABC-1234 ou ABC-1D23'"
></sq-input-mask-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newPlateControl = new FormControl('');`,
    },
  ];

  cardExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-mask)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask
  [label]="'Cartão de Crédito'"
  [mask]="'0000 0000 0000 0000'"
  [(value)]="oldCardValue"
  [name]="'card'"
></sq-input-mask>`,
    },
    {
      label: 'Componente Novo (sq-input-mask-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-mask-form-control
  [label]="'Cartão de Crédito'"
  [mask]="'0000 0000 0000 0000'"
  [formControl]="newCardControl"
  [placeholder]="'0000 0000 0000 0000'"
></sq-input-mask-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newCardControl = new FormControl('');`,
    },
  ];
}

