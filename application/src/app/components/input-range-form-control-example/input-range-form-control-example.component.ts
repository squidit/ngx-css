import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SqInputRangeComponent } from '../../../../../src/components/sq-input-range/sq-input-range.component';
import {
  SqInputRangeFormControlComponent,
  RangeValue,
} from '../../../../../src/components/sq-input-range-form-control/sq-input-range-form-control.component';
import { CodeTabsComponent, CodeExample } from '../code-tabs/code-tabs.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-input-range-form-control-example',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SqInputRangeComponent,
    SqInputRangeFormControlComponent,
    CodeTabsComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './input-range-form-control-example.component.html',
  styleUrls: ['./input-range-form-control-example.component.scss'],
})
export class InputRangeFormControlExampleComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', route: '/components-index', icon: 'fas fa-home' },
    { label: 'Input Range Form Control', icon: 'fas fa-sliders-h' },
  ];

  // Seção 1: Volume básico
  oldVolumeValue = 50;
  newVolumeControl = new FormControl<number>(50);

  // Seção 2: Temperatura com range customizado
  oldTempValue = 20;
  newTempControl = new FormControl<number>(20);

  // Seção 3: Step customizado
  oldStepValue = 0;
  newStepControl = new FormControl<number>(0);

  // Seção 4: Cor customizada (thumb verde)
  newColorControl = new FormControl<number>(75);

  // Seção 5: Cor da track (linha colorida)
  newTrackColorControl = new FormControl<number>(60);

  // Seção 6: Dual Range (intervalo)
  newDualRangeControl = new FormControl<RangeValue>({ min: 20, max: 80 });

  // Code Examples
  basicExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-range)',
      language: 'html',
      code: `<sq-input-range
  [label]="'Volume'"
  [(value)]="volume"
  [name]="'volume'"
></sq-input-range>`,
    },
    {
      label: 'Componente Novo (sq-input-range-form-control)',
      language: 'html',
      code: `<sq-input-range-form-control
  [label]="'Volume'"
  [formControl]="volumeControl"
></sq-input-range-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `volumeControl = new FormControl<number>(50);`,
    },
  ];

  rangeExampleCode: CodeExample[] = [
    {
      label: 'Componente Novo com Range Customizado',
      language: 'html',
      code: `<sq-input-range-form-control
  [label]="'Temperatura (°C)'"
  [formControl]="tempControl"
  [minNumber]="-10"
  [maxNumber]="40"
></sq-input-range-form-control>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `tempControl = new FormControl<number>(20);`,
    },
  ];

  stepExampleCode: CodeExample[] = [
    {
      label: 'Componente Novo com Step',
      language: 'html',
      code: `<sq-input-range-form-control
  [label]="'Desconto (%)'"
  [formControl]="stepControl"
  [minNumber]="0"
  [maxNumber]="100"
  [step]="5"
></sq-input-range-form-control>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `stepControl = new FormControl<number>(0);`,
    },
  ];

  colorExampleCode: CodeExample[] = [
    {
      label: 'Componente Novo com Cor do Thumb',
      language: 'html',
      code: `<sq-input-range-form-control
  [label]="'Progresso'"
  [formControl]="progressControl"
  [color]="'var(--color_system_success)'"
></sq-input-range-form-control>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `progressControl = new FormControl<number>(75);`,
    },
  ];

  trackColorExampleCode: CodeExample[] = [
    {
      label: 'Componente Novo com Cor da Track',
      language: 'html',
      code: `<sq-input-range-form-control
  [label]="'Brilho'"
  [formControl]="brightnessControl"
  [color]="'#ff6b35'"
  [trackColor]="'#ffe0d3'"
></sq-input-range-form-control>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `brightnessControl = new FormControl<number>(60);`,
    },
  ];

  dualRangeExampleCode: CodeExample[] = [
    {
      label: 'Componente Novo com Dual Range (Intervalo)',
      language: 'html',
      code: `<sq-input-range-form-control
  [label]="'Faixa de preço'"
  [formControl]="priceRangeControl"
  [minNumber]="0"
  [maxNumber]="100"
  [dualRange]="true"
  [color]="'var(--primary_color)'"
  [trackColor]="'#e0e0e0'"
></sq-input-range-form-control>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { RangeValue } from '@squidit/ngx-css';

// O valor é um objeto { min: number, max: number }
priceRangeControl = new FormControl<RangeValue>({ min: 20, max: 80 });

// Acessando os valores
console.log(this.priceRangeControl.value?.min); // 20
console.log(this.priceRangeControl.value?.max); // 80`,
    },
  ];
}
