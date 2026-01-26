import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputDemonstrationExampleComponent } from './components/input-demonstration-example/input-demonstration-example.component';
import { DateComparisonExampleComponent } from './components/date-comparison-example/date-comparison-example.component';
import { SelectorComparisonExampleComponent } from './components/selector-comparison-example/selector-comparison-example.component';
import { InputMaskFormControlExampleComponent } from './components/input-mask-form-control-example/input-mask-form-control-example.component';
import { InputMoneyFormControlExampleComponent } from './components/input-money-form-control-example/input-money-form-control-example.component';
import { InputNumberFormControlExampleComponent } from './components/input-number-form-control-example/input-number-form-control-example.component';
import { InputRangeFormControlExampleComponent } from './components/input-range-form-control-example/input-range-form-control-example.component';
import { InputFileFormControlExampleComponent } from './components/input-file-form-control-example/input-file-form-control-example.component';
import { SelectFormControlExampleComponent } from './components/select-form-control-example/select-form-control-example.component';
import { SelectMultiFormControlExampleComponent } from './components/select-multi-form-control-example/select-multi-form-control-example.component';
import { TextareaFormControlExampleComponent } from './components/textarea-form-control-example/textarea-form-control-example.component';
import { ComponentsIndexComponent } from './components/components-index/components-index.component';
import { ModalServiceExampleComponent } from './components/modal-service-example/modal-service-example.component';
import { ToastServiceExampleComponent } from './components/toast-service-example/toast-service-example.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/components-index',
    pathMatch: 'full',
  },
  {
    path: 'components-index',
    component: ComponentsIndexComponent,
    title: 'Novos Componentes de Formulário - @squidlib/ngx-css',
  },
  {
    path: 'input-demonstration',
    component: InputDemonstrationExampleComponent,
    title: 'Demonstração: sq-input-form-control',
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
    path: 'input-money-form-control',
    component: InputMoneyFormControlExampleComponent,
    title: 'Comparação: sq-input-money vs sq-input-money-form-control',
  },
  {
    path: 'input-number-form-control',
    component: InputNumberFormControlExampleComponent,
    title: 'Comparação: sq-input-number vs sq-input-number-form-control',
  },
  {
    path: 'input-range-form-control',
    component: InputRangeFormControlExampleComponent,
    title: 'Comparação: sq-input-range vs sq-input-range-form-control',
  },
  {
    path: 'input-file-form-control',
    component: InputFileFormControlExampleComponent,
    title: 'Comparação: sq-input-file vs sq-input-file-form-control',
  },
  {
    path: 'select-form-control',
    component: SelectFormControlExampleComponent,
    title: 'Comparação: sq-select vs sq-select-form-control',
  },
  {
    path: 'select-multi-form-control',
    component: SelectMultiFormControlExampleComponent,
    title: 'Comparação: sq-select-multi vs sq-select-multi-form-control',
  },
  {
    path: 'textarea-form-control',
    component: TextareaFormControlExampleComponent,
    title: 'Comparação: sq-textarea vs sq-textarea-form-control',
  },
  {
    path: 'modal-service',
    component: ModalServiceExampleComponent,
    title: 'SqModalService - Modal e Overlay',
  },
  {
    path: 'toast-service',
    component: ToastServiceExampleComponent,
    title: 'SqToastService - Notificações Toast',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
