import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SqInputMoneyComponent } from '../../../../../src/components/sq-input-money/sq-input-money.component';
import { SqInputMoneyFormControlComponent } from '../../../../../src/components/sq-input-money-form-control/sq-input-money-form-control.component';
import { SqValidationMessageComponent } from '../../../../../src/components/sq-validation-message/sq-validation-message.component';
import { SqValidationDirective } from '../../../../../src/directives/sq-validation.directive';
import { CodeTabsComponent, CodeExample } from '../code-tabs/code-tabs.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-input-money-form-control-example',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SqInputMoneyComponent,
    SqInputMoneyFormControlComponent,
    SqValidationMessageComponent,
    SqValidationDirective,
    CodeTabsComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './input-money-form-control-example.component.html',
  styleUrls: ['./input-money-form-control-example.component.scss'],
})
export class InputMoneyFormControlExampleComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', route: '/components-index', icon: 'fas fa-home' },
    { label: 'Input Money Form Control', icon: 'fas fa-dollar-sign' },
  ];

  // ========== Seção 1: Real Brasileiro (BRL) ==========
  oldBrlValue = 0;
  newBrlControl = new FormControl<number | null>(null);

  // ========== Seção 2: Dólar Americano (USD) ==========
  oldUsdValue = 0;
  newUsdControl = new FormControl<number | null>(null);

  // ========== Seção 3: Euro (EUR) ==========
  oldEurValue = 0;
  newEurControl = new FormControl<number | null>(null);

  // ========== Seção 4: Valor Obrigatório ==========
  oldRequiredValue = 0;
  newRequiredControl = new FormControl<number | null>(null, [Validators.required]);

  // ========== Seção 5: Valor com Mínimo ==========
  oldMinValue = 0;
  newMinControl = new FormControl<number | null>(null, [Validators.min(100)]);

  // Code Examples
  brlExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-money)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-money
  [label]="'Preço'"
  [(value)]="oldBrlValue"
  [name]="'price-brl'"
  [currency]="'BRL'"
></sq-input-money>`,
    },
    {
      label: 'TypeScript (Antigo)',
      language: 'typescript',
      code: `oldBrlValue = 0;`,
    },
    {
      label: 'Componente Novo (sq-input-money-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-money-form-control
  [label]="'Preço'"
  [formControl]="newBrlControl"
  [placeholder]="'0,00'"
></sq-input-money-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newBrlControl = new FormControl<number | null>(null);`,
    },
  ];

  usdExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-money)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-money
  [label]="'Price'"
  [(value)]="oldUsdValue"
  [name]="'price-usd'"
  [currency]="'USD'"
  [thousandSeparator]="','"
  [decimalMarker]="'.'"
></sq-input-money>`,
    },
    {
      label: 'Componente Novo (sq-input-money-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-money-form-control
  [label]="'Price'"
  [formControl]="newUsdControl"
  [currency]="'USD'"
  [thousandSeparator]="','"
  [decimalMarker]="'.'"
  [placeholder]="'0.00'"
></sq-input-money-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newUsdControl = new FormControl<number | null>(null);`,
    },
  ];

  eurExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-money)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-money
  [label]="'Preis'"
  [(value)]="oldEurValue"
  [name]="'price-eur'"
  [currency]="'EUR'"
></sq-input-money>`,
    },
    {
      label: 'Componente Novo (sq-input-money-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-money-form-control
  [label]="'Preis'"
  [formControl]="newEurControl"
  [currency]="'EUR'"
  [placeholder]="'0,00'"
></sq-input-money-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newEurControl = new FormControl<number | null>(null);`,
    },
  ];

  requiredExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-money)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-money
  [label]="'Valor Obrigatório *'"
  [(value)]="oldRequiredValue"
  [name]="'required-value'"
  [required]="true"
></sq-input-money>`,
    },
    {
      label: 'Componente Novo (sq-input-money-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-money-form-control
  [label]="'Valor Obrigatório *'"
  [formControl]="newRequiredControl"
  [placeholder]="'0,00'"
></sq-input-money-form-control>

<sq-validation-message
  [control]="newRequiredControl"
  [fieldName]="'Valor'"
  [showWhenTouched]="true"
></sq-validation-message>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newRequiredControl = new FormControl<number | null>(null, [Validators.required]);`,
    },
  ];

  minExampleCode: CodeExample[] = [
    {
      label: 'Componente Novo (sq-input-money-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-money-form-control
  [label]="'Valor Mínimo R$ 100,00 *'"
  [formControl]="newMinControl"
  [placeholder]="'0,00'"
  sqValidation
  [fieldName]="'Valor'"
></sq-input-money-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newMinControl = new FormControl<number | null>(null, [Validators.min(100)]);`,
    },
  ];
}

