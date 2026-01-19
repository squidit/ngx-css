import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SqSelectComponent } from '../../../../../src/components/sq-select/sq-select.component';
import { SqSelectSearchComponent } from '../../../../../src/components/sq-select-search/sq-select-search.component';
import {
  SqSelectFormControlComponent,
  OptionGroup,
} from '../../../../../src/components/sq-select-form-control/sq-select-form-control.component';
import { SqValidationDirective } from '../../../../../src/directives/sq-validation.directive';
import { Option } from '../../../../../src/interfaces/option.interface';
import { CodeTabsComponent, CodeExample } from '../code-tabs/code-tabs.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-select-form-control-example',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SqSelectComponent,
    SqSelectSearchComponent,
    SqSelectFormControlComponent,
    SqValidationDirective,
    CodeTabsComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './select-form-control-example.component.html',
  styleUrls: ['./select-form-control-example.component.scss'],
})
export class SelectFormControlExampleComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', route: '/components-index', icon: 'fas fa-home' },
    { label: 'Select Form Control', icon: 'fas fa-list' },
  ];

  // ============================================================
  // Lista mockada de produtos (100 itens)
  // ============================================================
  allProducts: Option[] = Array.from({ length: 100 }, (_, i) => ({
    value: i + 1,
    label: `Produto ${i + 1}`,
    data: { price: Math.floor(Math.random() * 1000) + 10, sku: `SKU-${String(i + 1).padStart(4, '0')}` },
  }));

  // Opções simples
  cities: Option[] = [
    { value: 'sp', label: 'São Paulo' },
    { value: 'rj', label: 'Rio de Janeiro' },
    { value: 'mg', label: 'Belo Horizonte' },
    { value: 'rs', label: 'Porto Alegre' },
    { value: 'pr', label: 'Curitiba' },
    { value: 'ba', label: 'Salvador' },
    { value: 'pe', label: 'Recife' },
    { value: 'ce', label: 'Fortaleza' },
  ];

  // Opções com grupos
  countriesWithGroups: OptionGroup[] = [
    {
      label: 'América do Sul',
      options: [
        { value: 'br', label: 'Brasil' },
        { value: 'ar', label: 'Argentina' },
        { value: 'cl', label: 'Chile' },
      ],
    },
    {
      label: 'Europa',
      options: [
        { value: 'pt', label: 'Portugal' },
        { value: 'es', label: 'Espanha' },
        { value: 'fr', label: 'França' },
      ],
    },
  ];

  // Usuários para template customizado
  users: Option[] = [
    { value: 1, label: 'João Silva', data: { email: 'joao@email.com', avatar: 'https://i.pravatar.cc/40?img=1' } },
    { value: 2, label: 'Maria Santos', data: { email: 'maria@email.com', avatar: 'https://i.pravatar.cc/40?img=2' } },
    { value: 3, label: 'Pedro Oliveira', data: { email: 'pedro@email.com', avatar: 'https://i.pravatar.cc/40?img=3' } },
    { value: 4, label: 'Ana Costa', data: { email: 'ana@email.com', avatar: 'https://i.pravatar.cc/40?img=4' } },
  ];

  // ============================================================
  // Seção 1: Select básico
  // ============================================================
  oldCityValue = '';
  newCityControl = new FormControl<Option | null>(null);

  // ============================================================
  // Seção 2: Com validação required
  // ============================================================
  newRequiredControl = new FormControl<Option | null>(null, [Validators.required]);

  // ============================================================
  // Seção 3: Com busca local - Comparativo sq-select-search
  // ============================================================
  oldSearchLocalValue?: Option;
  newSearchLocalControl = new FormControl<Option | null>(null);

  // ============================================================
  // Seção 4: Com busca remota + infinity scroll
  // ============================================================

  // Componente legado (sq-select-search) - já inicia com dados
  oldProducts: Option[] = Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: `Produto ${i + 1}`,
    data: { price: Math.floor(Math.random() * 1000) + 10, sku: `SKU-${String(i + 1).padStart(4, '0')}` },
  }));
  oldSearchRemoteValue?: Option;
  oldLoadingProducts = false;
  oldCurrentSearch = '';

  // Componente novo
  products: Option[] = [];
  hasMoreProducts = true;
  loadingProducts = false;
  currentPage = 0;
  currentSearch = '';
  newSearchRemoteControl = new FormControl<Option | null>(null);

  // ============================================================
  // Seção 5: Com grupos
  // ============================================================
  newGroupsControl = new FormControl<Option | null>(null);

  // ============================================================
  // Seção 6: Template customizado
  // ============================================================
  newCustomTemplateControl = new FormControl<Option | null>(null);

  // ============================================================
  // Seção 7: Cor do hover customizada
  // ============================================================
  hoverRedControl = new FormControl<Option | null>(null);
  hoverGreenControl = new FormControl<Option | null>(null);

  // ============================================================
  // Code Examples
  // ============================================================
  basicExampleCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-select)',
      language: 'html',
      code: `<sq-select
  [label]="'Cidade'"
  [options]="cities"
  [(value)]="city"
></sq-select>`,
    },
    {
      label: 'Componente Novo (sq-select-form-control)',
      language: 'html',
      code: `<sq-select-form-control
  [label]="'Cidade'"
  [options]="cities"
  [formControl]="cityControl"
></sq-select-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `cityControl = new FormControl<Option | null>(null);`,
    },
  ];

  searchLocalExampleCode: CodeExample[] = [
    {
      label: 'Componente Legado (sq-select-search)',
      language: 'html',
      code: `<sq-select-search
  [label]="'Cidade'"
  [options]="cities"
  [placeholderSearch]="'Buscar cidade...'"
  [(value)]="city"
></sq-select-search>`,
    },
    {
      label: 'Componente Novo com Busca Local',
      language: 'html',
      code: `<sq-select-form-control
  [label]="'Cidade'"
  [options]="cities"
  [formControl]="cityControl"
  [searchable]="'local'"
  [searchPlaceholder]="'Buscar cidade...'"
></sq-select-form-control>`,
    },
  ];

  searchRemoteExampleCode: CodeExample[] = [
    {
      label: 'Componente Novo com Busca Remota + Infinity Scroll',
      language: 'html',
      code: `<sq-select-form-control
  [label]="'Produto'"
  [options]="products"
  [formControl]="productControl"
  [searchable]="'remote'"
  [infiniteScroll]="true"
  [hasMore]="hasMoreProducts"
  [loading]="loadingProducts"
  [trackByFn]="customTrackBy"
  (searchChange)="searchProducts($event)"
  (loadMore)="loadMoreProducts()"
></sq-select-form-control>`,
    },
    {
      label: 'TypeScript - Simulação HTTP com slice',
      language: 'typescript',
      code: `// Lista mockada com 100 produtos
allProducts = Array.from({ length: 100 }, (_, i) => ({
  value: i + 1,
  label: \`Produto \${i + 1}\`,
  data: { price: Math.random() * 1000, sku: \`SKU-\${i + 1}\` },
}));

products: Option[] = [];
hasMoreProducts = true;
loadingProducts = false;
currentPage = 0;
currentSearch = '';
pageSize = 10;

// Simula busca remota
searchProducts(term: string) {
  this.currentSearch = term;
  this.currentPage = 0;
  this.loadingProducts = true;

  // Simula delay de API (500ms)
  setTimeout(() => {
    const filtered = this.allProducts.filter(p =>
      p.label.toLowerCase().includes(term.toLowerCase())
    );
    this.products = filtered.slice(0, this.pageSize);
    this.hasMoreProducts = filtered.length > this.pageSize;
    this.loadingProducts = false;
  }, 500);
}

// TrackBy customizado (opcional)
customTrackBy = (index: number, option: Option) => option.data?.sku || option.value;

// Carrega próxima página
loadMoreProducts() {
  if (this.loadingProducts || !this.hasMoreProducts) return;

  this.loadingProducts = true;
  this.currentPage++;

  setTimeout(() => {
    const filtered = this.allProducts.filter(p =>
      p.label.toLowerCase().includes(this.currentSearch.toLowerCase())
    );
    const start = this.currentPage * this.pageSize;
    const newItems = filtered.slice(start, start + this.pageSize);
    this.products = [...this.products, ...newItems];
    this.hasMoreProducts = start + this.pageSize < filtered.length;
    this.loadingProducts = false;
  }, 500);
}`,
    },
  ];

  customTemplateExampleCode: CodeExample[] = [
    {
      label: 'Componente Novo com Template Customizado',
      language: 'html',
      code: `<sq-select-form-control
  [label]="'Usuário'"
  [options]="users"
  [formControl]="userControl"
  [searchable]="'local'"
>
  <!-- Template para cada opção -->
  <ng-template #optionTemplate let-option>
    <div class="d-flex align-items-center gap-2">
      <img [src]="option.data?.avatar" class="avatar" />
      <div>
        <strong>{{ option.label }}</strong>
        <small>{{ option.data?.email }}</small>
      </div>
    </div>
  </ng-template>

  <!-- Template para valor selecionado -->
  <ng-template #selectedTemplate let-option>
    <div class="d-flex align-items-center gap-2">
      <img [src]="option.data?.avatar" class="avatar-sm" />
      <span>{{ option.label }}</span>
    </div>
  </ng-template>
</sq-select-form-control>`,
    },
  ];

  // ============================================================
  // TrackBy customizado para virtual scroll
  // ============================================================

  /**
   * TrackBy customizado usando SKU do produto.
   * Pode ser qualquer propriedade única do objeto.
   */
  customTrackBy = (_index: number, option: Option): unknown => {
    return option.data?.sku || option.value;
  };

  // ============================================================
  // Métodos para busca remota - Componente Legado
  // ============================================================

  searchOldProducts(term: string): void {
    this.oldCurrentSearch = term;
    this.oldLoadingProducts = true;

    // Simula delay de API
    setTimeout(() => {
      const filtered = this.allProducts.filter(p => p.label.toLowerCase().includes(term.toLowerCase()));
      // Retorna todos (sem paginação no legado)
      this.oldProducts = filtered.slice(0, 20);
      this.oldLoadingProducts = false;
    }, 500);
  }

  // ============================================================
  // Métodos para busca remota - Componente Novo
  // ============================================================

  searchProducts(term: string): void {
    this.currentSearch = term;
    this.currentPage = 0;
    this.loadingProducts = true;

    // Simula delay de API (500ms)
    setTimeout(() => {
      const filtered = this.allProducts.filter(p => p.label.toLowerCase().includes(term.toLowerCase()));
      // Primeira página: 10 itens
      this.products = filtered.slice(0, 10);
      this.hasMoreProducts = filtered.length > 10;
      this.loadingProducts = false;
    }, 500);
  }

  loadMoreProducts(): void {
    if (this.loadingProducts || !this.hasMoreProducts) return;

    this.loadingProducts = true;
    this.currentPage++;

    // Simula delay de API (500ms)
    setTimeout(() => {
      const filtered = this.allProducts.filter(p => p.label.toLowerCase().includes(this.currentSearch.toLowerCase()));
      const start = this.currentPage * 10;
      const newItems = filtered.slice(start, start + 10);
      this.products = [...this.products, ...newItems];
      this.hasMoreProducts = start + 10 < filtered.length;
      this.loadingProducts = false;
    }, 500);
  }
}
