import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputComparisonExampleComponent } from './components/input-comparison-example/input-comparison-example.component';
import { DateComparisonExampleComponent } from './components/date-comparison-example/date-comparison-example.component';
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
