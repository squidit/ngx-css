import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputComparisonExampleComponent } from './components/input-comparison-example/input-comparison-example.component';
import { DateComparisonExampleComponent } from './components/date-comparison-example/date-comparison-example.component';
import { SelectorComparisonExampleComponent } from './components/selector-comparison-example/selector-comparison-example.component';
import { InputMaskFormControlExampleComponent } from './components/input-mask-form-control-example/input-mask-form-control-example.component';
import { InputFileFormControlExampleComponent } from './components/input-file-form-control-example/input-file-form-control-example.component';
import { ComponentsIndexComponent } from './components/components-index/components-index.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/components-index',
    pathMatch: 'full',
  },
  {
    path: 'components-index',
    component: ComponentsIndexComponent,
    title: 'Novos Componentes de Formulário - @squidit/ngx-css',
  },
  {
    path: 'input-comparison',
    component: InputComparisonExampleComponent,
    title: 'Comparação: sq-input vs sq-input-form-control',
  },
  {
    path: 'date-comparison',
    component: DateComparisonExampleComponent,
    title: 'Comparação: sq-input-date vs sq-input-date-form-control',
  },
  {
    path: 'selector-comparison',
    component: SelectorComparisonExampleComponent,
    title: 'Comparação: sq-selector vs sq-selector-form-control',
  },
  {
    path: 'input-mask-form-control',
    component: InputMaskFormControlExampleComponent,
    title: 'Comparação: sq-input-mask vs sq-input-mask-form-control',
  },
  {
    path: 'input-file-form-control',
    component: InputFileFormControlExampleComponent,
    title: 'Comparação: sq-input-file vs sq-input-file-form-control',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
