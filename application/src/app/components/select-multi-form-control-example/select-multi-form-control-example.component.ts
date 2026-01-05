import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SqSelectMultiComponent } from '../../../../../src/components/sq-select-multi/sq-select-multi.component';
import { SqSelectMultiTagsComponent } from '../../../../../src/components/sq-select-multi-tags/sq-select-multi-tags.component';
import { SqSelectMultiFormControlComponent } from '../../../../../src/components/sq-select-multi-form-control/sq-select-multi-form-control.component';
import { SqValidationDirective } from '../../../../../src/directives/sq-validation.directive';
import { OptionMulti } from '../../../../../src/interfaces/option.interface';
import { CodeTabsComponent, CodeExample } from '../code-tabs/code-tabs.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-select-multi-form-control-example',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SqSelectMultiComponent,
    SqSelectMultiTagsComponent,
    SqSelectMultiFormControlComponent,
    SqValidationDirective,
    CodeTabsComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './select-multi-form-control-example.component.html',
  styleUrls: ['./select-multi-form-control-example.component.scss'],
})
export class SelectMultiFormControlExampleComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', route: '/components-index', icon: 'fas fa-home' },
    { label: 'Select Multi Form Control', icon: 'fas fa-list-check' },
  ];

  // Opções simples
  cities: OptionMulti[] = [
    { value: 'sp', label: 'São Paulo' },
    { value: 'rj', label: 'Rio de Janeiro' },
    { value: 'mg', label: 'Belo Horizonte' },
    { value: 'rs', label: 'Porto Alegre' },
    { value: 'pr', label: 'Curitiba' },
    { value: 'ba', label: 'Salvador' },
    { value: 'pe', label: 'Recife' },
    { value: 'ce', label: 'Fortaleza' },
  ];

  // Opções com hierarquia
  categories: OptionMulti[] = [
    {
      value: 'tech',
      label: 'Tecnologia',
      children: [
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
        { value: 'mobile', label: 'Mobile' },
      ],
    },
    {
      value: 'design',
      label: 'Design',
      children: [
        { value: 'ui', label: 'UI Design' },
        { value: 'ux', label: 'UX Design' },
        { value: 'graphic', label: 'Design Gráfico' },
      ],
    },
    {
      value: 'marketing',
      label: 'Marketing',
      children: [
        { value: 'social', label: 'Social Media' },
        { value: 'seo', label: 'SEO' },
        { value: 'content', label: 'Conteúdo' },
      ],
    },
  ];

  // Lista mockada para busca remota
  allProducts: OptionMulti[] = Array.from({ length: 100 }, (_, i) => ({
    value: i + 1,
    label: `Produto ${i + 1}`,
  }));
  products: OptionMulti[] = [];
  hasMoreProducts = true;
  loadingProducts = false;
  currentPage = 0;
  currentSearch = '';

  // ============================================================
  // Seção 1: Modo Default - Comparativo com sq-select-multi
  // ============================================================
  oldDefaultValue: OptionMulti[] = [];
  newDefaultControl = new FormControl<OptionMulti[]>([]);

  // ============================================================
  // Seção 2: Modo Tags - Comparativo com sq-select-multi-tags
  // ============================================================
  oldTagsValue: OptionMulti[] = [];
  newTagsControl = new FormControl<OptionMulti[]>([]);

  // ============================================================
  // Seção 3: Com validação
  // ============================================================
  newRequiredControl = new FormControl<OptionMulti[]>([], [Validators.required]);

  // ============================================================
  // Seção 4: Com hierarquia
  // ============================================================
  newHierarchyControl = new FormControl<OptionMulti[]>([]);

  // ============================================================
  // Seção 5: Com busca remota + infinity scroll
  // ============================================================

  // Componente legado (sq-select-multi) - já inicia com dados
  oldProducts: OptionMulti[] = Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: `Produto ${i + 1}`,
  }));
  oldRemoteValue: OptionMulti[] = [];
  oldLoadingProducts = false;
  oldCurrentSearch = '';

  // Componente novo
  newRemoteControl = new FormControl<OptionMulti[]>([]);

  // ============================================================
  // Seção 6: Com máximo de seleções
  // ============================================================
  newMaxSelectionsControl = new FormControl<OptionMulti[]>([]);

  // ============================================================
  // Seção 7: Templates Customizados
  // ============================================================
  newCustomTemplateControl = new FormControl<OptionMulti[]>([]);
  newSelectedTemplateControl = new FormControl<OptionMulti[]>([]);

  // Usuários para demonstrar templates customizados
  users: (OptionMulti & { avatar: string; role: string })[] = [
    { value: 1, label: 'Ana Silva', avatar: 'https://i.pravatar.cc/40?img=1', role: 'Desenvolvedora' },
    { value: 2, label: 'Bruno Costa', avatar: 'https://i.pravatar.cc/40?img=2', role: 'Designer' },
    { value: 3, label: 'Carla Souza', avatar: 'https://i.pravatar.cc/40?img=3', role: 'Product Manager' },
    { value: 4, label: 'Diego Lima', avatar: 'https://i.pravatar.cc/40?img=4', role: 'Tech Lead' },
    { value: 5, label: 'Eva Santos', avatar: 'https://i.pravatar.cc/40?img=5', role: 'QA Engineer' },
    { value: 6, label: 'Felipe Rocha', avatar: 'https://i.pravatar.cc/40?img=6', role: 'DevOps' },
  ];

  // TrackBy customizado
  customTrackBy = (index: number, option: OptionMulti): unknown => {
    return option.value;
  };

  // Code Examples
  defaultModeCode: CodeExample[] = [
    {
      label: 'Legado (sq-select-multi)',
      language: 'html',
      code: `<sq-select-multi
  [label]="'Cidades'"
  [options]="cities"
  [(value)]="selectedCities"
></sq-select-multi>`,
    },
    {
      label: 'Novo (displayMode="default")',
      language: 'html',
      code: `<sq-select-multi-form-control
  [label]="'Cidades'"
  [options]="cities"
  [formControl]="citiesControl"
  [displayMode]="'default'"
></sq-select-multi-form-control>`,
    },
  ];

  tagsModeCode: CodeExample[] = [
    {
      label: 'Legado (sq-select-multi-tags)',
      language: 'html',
      code: `<sq-select-multi-tags
  [label]="'Tags'"
  [options]="tags"
  [(value)]="selectedTags"
></sq-select-multi-tags>`,
    },
    {
      label: 'Novo (displayMode="tags")',
      language: 'html',
      code: `<sq-select-multi-form-control
  [label]="'Tags'"
  [options]="tags"
  [formControl]="tagsControl"
  [displayMode]="'tags'"
></sq-select-multi-form-control>`,
    },
  ];

  remoteSearchCode: CodeExample[] = [
    {
      label: 'Busca Remota + Infinity Scroll',
      language: 'html',
      code: `<sq-select-multi-form-control
  [label]="'Produtos'"
  [options]="products"
  [formControl]="productsControl"
  [searchable]="'remote'"
  [infiniteScroll]="true"
  [hasMore]="hasMoreProducts"
  [loading]="loadingProducts"
  (searchChange)="searchProducts($event)"
  (loadMore)="loadMoreProducts()"
></sq-select-multi-form-control>`,
    },
  ];

  customTemplateCode: CodeExample[] = [
    {
      label: 'optionTemplate + tagTemplate',
      language: 'html',
      code: `<sq-select-multi-form-control
  [options]="users"
  [formControl]="usersControl"
  [displayMode]="'tags'"
  [trackByFn]="customTrackBy"
>
  <!-- Template para opções no dropdown -->
  <ng-template #optionTemplate let-option>
    <div class="custom-option">
      <img [src]="option.avatar" class="user-avatar" />
      <div class="user-info">
        <span class="user-name">{{ option.label }}</span>
        <small class="user-role">{{ option.role }}</small>
      </div>
    </div>
  </ng-template>

  <!-- Template para tags selecionadas -->
  <ng-template #tagTemplate let-option let-remove="remove">
    <span class="custom-tag">
      <img [src]="option.avatar" class="tag-avatar" />
      {{ option.label }}
      <i class="fas fa-times" (click)="remove(option, $event)"></i>
    </span>
  </ng-template>
</sq-select-multi-form-control>`,
    },
    {
      label: 'selectedTemplate (modo default)',
      language: 'html',
      code: `<sq-select-multi-form-control
  [options]="users"
  [formControl]="usersControl"
  [displayMode]="'default'"
  [trackByFn]="customTrackBy"
>
  <!-- Template para valor selecionado no input -->
  <ng-template #selectedTemplate let-selected let-count="count">
    <div class="custom-selected">
      <div class="avatars-stack">
        @for (user of selected | slice:0:3; track user.value) {
          <img [src]="user.avatar" class="stacked-avatar" />
        }
      </div>
      <span>{{ count }} usuário(s)</span>
    </div>
  </ng-template>
</sq-select-multi-form-control>`,
    },
    {
      label: 'trackByFn',
      language: 'typescript',
      code: `// No componente TypeScript:
customTrackBy = (index: number, option: OptionMulti): unknown => {
  return option.value; // ou qualquer identificador único
};`,
    },
  ];

  // ============================================================
  // Métodos para busca remota
  // ============================================================

  // Busca para componente legado
  searchOldProducts(term: string): void {
    this.oldCurrentSearch = term;
    this.oldLoadingProducts = true;

    setTimeout(() => {
      const filtered = this.allProducts.filter(p => p.label.toLowerCase().includes(term.toLowerCase()));
      // Componente legado não tem paginação, retorna todos (limitado a 20)
      this.oldProducts = filtered.slice(0, 20);
      this.oldLoadingProducts = false;
    }, 500);
  }

  // Busca para componente novo
  searchProducts(term: string): void {
    this.currentSearch = term;
    this.currentPage = 0;
    this.loadingProducts = true;

    setTimeout(() => {
      const filtered = this.allProducts.filter(p => p.label.toLowerCase().includes(term.toLowerCase()));
      this.products = filtered.slice(0, 10);
      this.hasMoreProducts = filtered.length > 10;
      this.loadingProducts = false;
    }, 500);
  }

  loadMoreProducts(): void {
    if (this.loadingProducts || !this.hasMoreProducts) return;

    this.loadingProducts = true;
    this.currentPage++;

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


