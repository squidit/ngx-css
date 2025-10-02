# Guia de Migração para Componentes Standalone

## Visão Geral

Os componentes da biblioteca ngx-css foram migrados para **standalone components** do Angular. Esta migração oferece melhor tree-shaking, carregamento mais rápido e maior flexibilidade.

## Compatibilidade

⚠️ **IMPORTANTE**: O `SquidCSSModule` foi marcado como **deprecated** mas ainda funciona para manter compatibilidade com aplicações existentes.

## Como Migrar

### Antes (usando SquidCSSModule)

```typescript
// app.module.ts
import { SquidCSSModule } from 'ngx-css';

@NgModule({
  imports: [
    SquidCSSModule // ❌ Deprecated
  ]
})
export class AppModule { }
```

### Depois (usando componentes standalone)

#### Opção 1: Import direto no componente standalone

```typescript
// meu-componente.component.ts
import { Component } from '@angular/core';
import { SqButtonComponent, SqModalComponent, SqLoaderComponent } from 'ngx-css';

@Component({
  selector: 'app-meu-componente',
  standalone: true,
  imports: [SqButtonComponent, SqModalComponent, SqLoaderComponent], // ✅ Recomendado
  template: `
    <sq-button (emitClick)="onClick()">Clique aqui</sq-button>
    <sq-modal [open]="showModal">
      <p>Conteúdo do modal</p>
    </sq-modal>
  `
})
export class MeuComponente { }
```

#### Opção 2: Import no módulo (para componentes não-standalone)

```typescript
// app.module.ts
import { SqButtonComponent, SqModalComponent, SqLoaderComponent } from 'ngx-css';

@NgModule({
  imports: [
    SqButtonComponent,
    SqModalComponent, 
    SqLoaderComponent
  ],
  declarations: [MeuComponente]
})
export class AppModule { }
```

## Componentes Migrados

### ✅ Disponíveis como Standalone

**Componentes Básicos:**
- `SqButtonComponent`
- `SqLoaderComponent` 
- `SqProgressBarComponent`
- `SqTagComponent`

**Componentes Avançados:**
- `SqModalComponent`
- `SqStepsComponent`
- `SqTooltipComponent`
- `SqTabsComponent`
- `SqTabComponent`

**Componentes de Formulário:**
- `SqInputComponent`
- `SqInputFileComponent`
- `SqInputDateComponent`
- `SqInputMaskComponent`
- `SqInputMoneyComponent`
- `SqInputNumberComponent`
- `SqTextAreaComponent`

**Diretivas:**
- `SqClickOutsideDirective`
- `SqTooltipDirective`

**Pipes:**
- `UniversalSafePipe`

### 🔄 Em Migração

Os demais componentes ainda estão sendo migrados. Eles continuam disponíveis através do `SquidCSSModule`.

## Novidades nos Templates

Os componentes migrados agora usam a nova sintaxe de controle de fluxo do Angular:

### Antes
```html
<div *ngIf="loading">Carregando...</div>
<div *ngFor="let item of items">{{ item }}</div>
```

### Depois  
```html
@if (loading) {
  <div>Carregando...</div>
}
@for (item of items; track item.id) {
  <div>{{ item }}</div>
}
```

## Benefícios da Migração

1. **Tree-shaking**: Apenas os componentes usados são incluídos no bundle
2. **Performance**: Carregamento mais rápido da aplicação
3. **Flexibilidade**: Maior controle sobre imports
4. **Futuro**: Preparação para versões futuras do Angular

## Cronograma

- **Fase 1** ✅: Componentes básicos (Button, Loader, Tag, Progress Bar)
- **Fase 2** ✅: Componentes com dependências (Modal + ClickOutside)
- **Fase 3** ✅: Componentes de navegação (Steps, Tabs, Tooltip)
- **Fase 4** ✅: Componentes de formulário básicos (Input, TextArea, InputFile, InputDate)
- **Fase 5** ✅: Componentes de formulário especializados (InputMask, InputMoney, InputNumber)
- **Fase 6** 📅: Componentes de seleção (Select, SelectMulti, etc.)
- **Fase 7** 📅: Componentes complexos (Accordion, Overlay, etc.)
- **Fase 8** 📅: Remoção do SquidCSSModule (breaking change)

## Suporte

Durante o período de transição, ambas as formas funcionam:
- ✅ `SquidCSSModule` (deprecated, mas funcional)  
- ✅ Componentes standalone individuais (recomendado)

## Exemplo Completo

```typescript
// exemplo-completo.component.ts
import { Component } from '@angular/core';
import { 
  SqButtonComponent, 
  SqModalComponent, 
  SqLoaderComponent,
  SqTagComponent,
  SqProgressBarComponent,
  SqStepsComponent,
  SqTabsComponent,
  SqTabComponent,
  SqTooltipComponent,
  SqInputComponent,
  SqInputFileComponent,
  SqInputDateComponent,
  SqInputMaskComponent,
  SqInputMoneyComponent,
  SqInputNumberComponent,
  SqTextAreaComponent
} from 'ngx-css';

@Component({
  selector: 'app-exemplo',
  standalone: true,
  imports: [
    SqButtonComponent,
    SqModalComponent, 
    SqLoaderComponent,
    SqTagComponent,
    SqProgressBarComponent,
    SqStepsComponent,
    SqTabsComponent,
    SqTabComponent,
    SqTooltipComponent,
    SqInputComponent,
    SqInputFileComponent,
    SqInputDateComponent,
    SqInputMaskComponent,
    SqInputMoneyComponent,
    SqInputNumberComponent,
    SqTextAreaComponent
  ],
  template: `
    <sq-button 
      color="primary" 
      [loading]="isLoading"
      (emitClick)="openModal()">
      Abrir Modal
    </sq-button>

    <sq-progress-bar 
      [value]="progress" 
      [striped]="true">
    </sq-progress-bar>

    <sq-tag color="success">
      Status: Ativo
    </sq-tag>

    <sq-steps 
      [active]="currentStep" 
      [steps]="stepsList"
      (emitClick)="onStepClick($event)">
    </sq-steps>

    <sq-tabs [lineStyle]="true" (tabChange)="onTabChange($event)">
      <sq-tab title="Aba 1">
        <p>Conteúdo da primeira aba</p>
      </sq-tab>
      <sq-tab title="Aba 2">
        <p>Conteúdo da segunda aba</p>
      </sq-tab>
    </sq-tabs>

    <sq-tooltip 
      message="Dica importante!" 
      placement="center top">
    </sq-tooltip>

    <sq-input 
      label="Nome completo"
      placeholder="Digite seu nome"
      [(value)]="userName">
    </sq-input>

    <sq-textarea 
      label="Descrição"
      placeholder="Digite uma descrição..."
      [(value)]="description">
    </sq-textarea>

    <sq-input-file 
      label="Upload de arquivo"
      placeholder="Selecionar arquivo"
      [(value)]="selectedFile">
    </sq-input-file>

    <sq-input-date 
      label="Data de nascimento"
      [(value)]="birthDate">
    </sq-input-date>

    <sq-input-mask 
      label="Telefone"
      mask="(00) 00000-0000"
      [(value)]="phone">
    </sq-input-mask>

    <sq-input-money 
      label="Valor"
      [(value)]="amount">
    </sq-input-money>

    <sq-input-number 
      label="Quantidade"
      [(value)]="quantity">
    </sq-input-number>

    <sq-modal 
      [open]="showModal" 
      (modalClose)="closeModal()">
      <ng-template #headerModal>
        <h3>Título do Modal</h3>
      </ng-template>
      
      <p>Conteúdo do modal aqui...</p>
      
      <ng-template #footerModal>
        <sq-button (emitClick)="closeModal()">
          Fechar
        </sq-button>
      </ng-template>
    </sq-modal>
  `
})
export class ExemploComponent {
  isLoading = false;
  showModal = false;
  progress = 75;
  currentStep = 1;
  userName = '';
  description = '';
  selectedFile: File[] = [];
  birthDate = new Date();
  phone = '';
  amount = 0;
  quantity = 0;
  stepsList = [
    { tip: 'Primeiro passo' },
    { tip: 'Segundo passo' },
    { tip: 'Terceiro passo' }
  ];

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onStepClick(event: any) {
    this.currentStep = event.i;
  }

  onTabChange(event: any) {
    console.log('Tab alterada:', event);
  }
}
```
