import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SqInputDateComponent } from '../../../../../src/components/sq-input-date/sq-input-date.component';
import { SqInputDateFormControlComponent } from '../../../../../src/components/sq-input-date-form-control/sq-input-date-form-control.component';
import { SqValidationDirective } from '../../../../../src/directives/sq-validation.directive';
import { DateValidators } from '../../../../../src/validators/date.validators';
import { CodeTabsComponent, CodeExample } from '../code-tabs/code-tabs.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-date-comparison-example',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SqInputDateComponent,
    SqInputDateFormControlComponent,
    SqValidationDirective,
    CodeTabsComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './date-comparison-example.component.html',
  styleUrls: ['./date-comparison-example.component.scss'],
})
export class DateComparisonExampleComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', route: '/components-index', icon: 'fas fa-home' },
    { label: 'Comparação de Dates', icon: 'fas fa-calendar' },
  ];
  // ========== Seção 1: Comparação Básica ==========
  oldBasicDate = '';
  newBasicControl = new FormControl('');

  // ========== Seção 2: Data Obrigatória ==========
  oldRequiredDate = '';
  newRequiredControl = new FormControl('', [Validators.required]);

  // ========== Seção 3: Range de Datas ==========
  oldRangeDate = '';
  // Nota: DateValidators.minDate() e maxDate() serão adicionados automaticamente
  // pelo componente quando [minDate] e [maxDate] são fornecidos
  newRangeControl = new FormControl('', [Validators.required]);

  // ========== Seção 4: Data de Nascimento ==========
  oldBirthdateDate = '';
  newBirthdateControl = new FormControl('', [Validators.required, DateValidators.birthdate(18, 100)]);

  // ========== Seção 5: Data Passada ==========
  oldPastDate = '';
  newPastControl = new FormControl('', [Validators.required, DateValidators.pastDate()]);

  // ========== Seção 6: Data Futura ==========
  oldFutureDate = '';
  newFutureControl = new FormControl('', [Validators.required, DateValidators.futureDate()]);

  // ========== Seção 7: FormGroup Completo ==========
  dateForm = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    birthdate: new FormControl('', [Validators.required, DateValidators.birthdate(18, 100)]),
  });

  // ========== Seção 8: Com Diretiva ==========
  directiveRequiredControl = new FormControl('', [Validators.required]);
  directiveBirthdateControl = new FormControl('', [Validators.required, DateValidators.birthdate(18, 100)]);
  // Nota: DateValidators.minDate() e maxDate() serão adicionados automaticamente
  directiveRangeControl = new FormControl('', [Validators.required]);

  customMessages = {
    required: 'Por favor, selecione uma data',
    invalidDate: 'Data inválida',
    minDate: 'Data deve ser posterior a {minDate}',
    maxDate: 'Data deve ser anterior a {maxDate}',
    birthdate: 'Idade deve estar entre {minAge} e {maxAge} anos',
  };

  // ========== Code Examples ==========
  basicExampleCode: CodeExample[] = [
    {
      label: 'HTML (Antigo)',
      language: 'html',
      code: `<!-- Componente Antigo (sq-input-date) -->
<sq-input-date
  [id]="'old-basic-date'"
  [name]="'old-basic-date'"
  [label]="'Data (Componente Antigo)'"
  [(value)]="oldBasicDate"
></sq-input-date>`,
    },
    {
      label: 'HTML (Novo)',
      language: 'html',
      code: `<!-- Componente Novo (sq-input-date-form-control) -->
<sq-input-date-form-control
  [id]="'new-basic-date'"
  [name]="'new-basic-date'"
  [label]="'Data (Componente Novo)'"
  [formControl]="newBasicControl"
></sq-input-date-form-control>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `// Antigo: Two-way binding
oldBasicDate = '';

// Novo: FormControl com Reactive Forms
newBasicControl = new FormControl('');`,
    },
  ];

  requiredExampleCode: CodeExample[] = [
    {
      label: 'HTML (Antigo)',
      language: 'html',
      code: `<!-- Componente Antigo -->
<sq-input-date
  [id]="'old-required'"
  [name]="'old-required'"
  [label]="'Data Obrigatória (Antigo)'"
  [required]="true"
  [(value)]="oldRequiredDate"
></sq-input-date>`,
    },
    {
      label: 'HTML (Novo)',
      language: 'html',
      code: `<!-- Componente Novo com Validator -->
<sq-input-date-form-control
  [id]="'new-required'"
  [name]="'new-required'"
  [label]="'Data Obrigatória (Novo)'"
  [formControl]="newRequiredControl"
></sq-input-date-form-control>
<sq-validation-message
  [control]="newRequiredControl"
  [fieldName]="'Data'"
></sq-validation-message>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { FormControl, Validators } from '@angular/forms';

// Antigo: required como @Input
oldRequiredDate = '';

// Novo: Validators.required
newRequiredControl = new FormControl('', [Validators.required]);`,
    },
  ];

  rangeExampleCode: CodeExample[] = [
    {
      label: 'HTML (Antigo)',
      language: 'html',
      code: `<!-- Componente Antigo -->
<sq-input-date
  [id]="'old-range'"
  [name]="'old-range'"
  [label]="'Data de Evento 2024 (Antigo)'"
  [required]="true"
  [minDate]="'2024-01-01'"
  [maxDate]="'2024-12-31'"
  [(value)]="oldRangeDate"
></sq-input-date>`,
    },
    {
      label: 'HTML (Novo)',
      language: 'html',
      code: `<!-- Componente Novo com DateValidators e atributos HTML -->
<sq-input-date-form-control
  [id]="'new-range'"
  [name]="'new-range'"
  [label]="'Data de Evento 2024 (Novo)'"
  [formControl]="newRangeControl"
  [minDate]="'2024-01-01'"
  [maxDate]="'2024-12-31'"
></sq-input-date-form-control>
<sq-validation-message
  [control]="newRangeControl"
  [fieldName]="'Data'"
></sq-validation-message>

<!-- IMPORTANTE: 
  - [minDate] e [maxDate] aplicam os atributos HTML min/max
    que desabilitam datas fora do range no seletor do navegador
  - DateValidators.minDate() e maxDate() no FormControl
    fornecem a validação após a seleção
-->`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { FormControl, Validators } from '@angular/forms';
import { DateValidators } from '@squidlib/ngx-css';

// Antigo: minDate e maxDate como @Input
oldRangeDate = '';

// Novo: Validators automáticos quando [minDate] e [maxDate] são fornecidos!
// DateValidators.minDate() e maxDate() são adicionados automaticamente pelo componente
newRangeControl = new FormControl('', [Validators.required]);

// Você PODE adicionar manualmente se quiser, mas não é necessário:
// newRangeControl = new FormControl('', [
//   Validators.required,
//   DateValidators.minDate('2024-01-01'),
//   DateValidators.maxDate('2024-12-31')
// ]);`,
    },
  ];

  birthdateExampleCode: CodeExample[] = [
    {
      label: 'HTML (Antigo)',
      language: 'html',
      code: `<!-- Componente Antigo -->
<sq-input-date
  [id]="'old-birthdate'"
  [name]="'old-birthdate'"
  [label]="'Data de Nascimento (Antigo)'"
  [required]="true"
  [(value)]="oldBirthdateDate"
></sq-input-date>
<small class="text-muted">Validação customizada de idade não disponível</small>`,
    },
    {
      label: 'HTML (Novo)',
      language: 'html',
      code: `<!-- Componente Novo com validação de idade -->
<sq-input-date-form-control
  [id]="'new-birthdate'"
  [name]="'new-birthdate'"
  [label]="'Data de Nascimento (Novo)'"
  [formControl]="newBirthdateControl"
></sq-input-date-form-control>
<sq-validation-message
  [control]="newBirthdateControl"
  [fieldName]="'Data de Nascimento'"
  [showWhenTouched]="true"
  [showWhenDirty]="true"
></sq-validation-message>
<small class="text-success">✓ Valida idade entre 18 e 100 anos automaticamente</small>
<small class="text-info">💡 Erro aparece ao tocar OU selecionar data inválida</small>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { FormControl, Validators } from '@angular/forms';
import { DateValidators } from '@squidlib/ngx-css';

// Antigo: sem validação de idade
oldBirthdateDate = '';

// Novo: DateValidators.birthdate(minAge, maxAge)
newBirthdateControl = new FormControl('', [
  Validators.required,
  DateValidators.birthdate(18, 100)
]);`,
    },
  ];

  pastDateExampleCode: CodeExample[] = [
    {
      label: 'HTML (Novo)',
      language: 'html',
      code: `<!-- Apenas data passada é válida -->
<sq-input-date-form-control
  [id]="'past-date'"
  [name]="'past-date'"
  [label]="'Data no Passado'"
  [formControl]="newPastControl"
></sq-input-date-form-control>
<sq-validation-message
  [control]="newPastControl"
  [fieldName]="'Data'"
  [showWhenTouched]="true"
  [showWhenDirty]="true"
></sq-validation-message>
<small class="text-info">💡 Erro ao tocar OU selecionar data futura</small>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { FormControl, Validators } from '@angular/forms';
import { DateValidators } from '@squidlib/ngx-css';

newPastControl = new FormControl('', [
  Validators.required,
  DateValidators.pastDate()
]);`,
    },
  ];

  futureDateExampleCode: CodeExample[] = [
    {
      label: 'HTML (Novo)',
      language: 'html',
      code: `<!-- Apenas data futura é válida -->
<sq-input-date-form-control
  [id]="'future-date'"
  [name]="'future-date'"
  [label]="'Data no Futuro'"
  [formControl]="newFutureControl"
></sq-input-date-form-control>
<sq-validation-message
  [control]="newFutureControl"
  [fieldName]="'Data'"
  [showWhenTouched]="true"
  [showWhenDirty]="true"
></sq-validation-message>
<small class="text-info">💡 Erro ao tocar OU selecionar data passada</small>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { FormControl, Validators } from '@angular/forms';
import { DateValidators } from '@squidlib/ngx-css';

newFutureControl = new FormControl('', [
  Validators.required,
  DateValidators.futureDate()
]);`,
    },
  ];

  formGroupExampleCode: CodeExample[] = [
    {
      label: 'HTML',
      language: 'html',
      code: `<form [formGroup]="dateForm" (ngSubmit)="submitDateForm()">
  <div class="row">
    <div class="col-md-6">
      <sq-input-date-form-control
        [label]="'Data de Início'"
        formControlName="startDate"
      ></sq-input-date-form-control>
      <sq-validation-message
        [control]="dateForm.get('startDate')"
        [fieldName]="'Data de Início'"
      ></sq-validation-message>
    </div>

    <div class="col-md-6">
      <sq-input-date-form-control
        [label]="'Data de Término'"
        formControlName="endDate"
      ></sq-input-date-form-control>
      <sq-validation-message
        [control]="dateForm.get('endDate')"
        [fieldName]="'Data de Término'"
      ></sq-validation-message>
    </div>
  </div>

  <sq-input-date-form-control
    [label]="'Data de Nascimento'"
    formControlName="birthdate"
  ></sq-input-date-form-control>
  <sq-validation-message
    [control]="dateForm.get('birthdate')"
    [fieldName]="'Data de Nascimento'"
  ></sq-validation-message>

  <button 
    type="submit" 
    class="btn btn-primary mt-3"
    [disabled]="dateForm.invalid"
  >
    Enviar Formulário
  </button>
</form>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateValidators } from '@squidlib/ngx-css';

dateForm = new FormGroup({
  startDate: new FormControl('', [Validators.required]),
  endDate: new FormControl('', [Validators.required]),
  birthdate: new FormControl('', [
    Validators.required,
    DateValidators.birthdate(18, 100)
  ])
});

submitDateForm() {
  if (this.dateForm.valid) {
    console.log('Valores:', this.dateForm.value);
    // Processar formulário...
  }
}`,
    },
  ];

  directiveExampleCode: CodeExample[] = [
    {
      label: 'HTML (Básico)',
      language: 'html',
      code: `<!-- Com diretiva sqValidation -->
<sq-input-date-form-control
  [formControl]="directiveRequiredControl"
  [label]="'Data com Diretiva'"
  sqValidation
  [fieldName]="'Data'"
  [showWhen]="'touchedOrDirty'"
></sq-input-date-form-control>`,
    },
    {
      label: 'HTML (Mensagens Customizadas)',
      language: 'html',
      code: `<!-- Com mensagens customizadas -->
<sq-input-date-form-control
  [formControl]="directiveBirthdateControl"
  [label]="'Data de Nascimento com Mensagens Customizadas'"
  sqValidation
  [fieldName]="'Data de Nascimento'"
  [customErrorMessages]="customMessages"
  [showWhen]="'touchedOrDirty'"
></sq-input-date-form-control>`,
    },
    {
      label: 'HTML (Range com Diretiva)',
      language: 'html',
      code: `<!-- Range de datas com diretiva -->
<sq-input-date-form-control
  [formControl]="directiveRangeControl"
  [label]="'Data de Evento 2024 (com diretiva)'"
  [minDate]="'2024-01-01'"
  [maxDate]="'2024-12-31'"
  sqValidation
  [fieldName]="'Data do Evento'"
  [customErrorMessages]="{
    required: 'Selecione a data do evento',
    minDate: 'Evento deve ser em 2024',
    maxDate: 'Evento deve ser em 2024'
  }"
  [showWhen]="'touchedOrDirty'"
></sq-input-date-form-control>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { FormControl, Validators } from '@angular/forms';
import { DateValidators } from '@squidlib/ngx-css';

// Controle simples com required
directiveRequiredControl = new FormControl('', [Validators.required]);

// Controle com validação de idade
directiveBirthdateControl = new FormControl('', [
  Validators.required,
  DateValidators.birthdate(18, 100)
]);

// Controle com range - validators adicionados automaticamente!
// Quando você passa [minDate] e [maxDate] no template,
// o componente adiciona os validators automaticamente
directiveRangeControl = new FormControl('', [Validators.required]);

// Mensagens customizadas opcionais
customMessages = {
  required: 'Por favor, selecione uma data',
  invalidDate: 'Data inválida',
  minDate: 'Data deve ser posterior a {minDate}',
  maxDate: 'Data deve ser anterior a {maxDate}',
  birthdate: 'Idade deve estar entre {minAge} e {maxAge} anos'
};`,
    },
  ];

  submitDateForm() {
    if (this.dateForm.valid) {
      console.log('Formulário válido:', this.dateForm.value);
      alert('Formulário enviado com sucesso! Veja o console para os valores.');
    }
  }
}
