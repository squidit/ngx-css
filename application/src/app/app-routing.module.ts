import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalServiceDocsComponent } from './pages/modal-service-docs/modal-service-docs.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'modal-service',
    pathMatch: 'full'
  },
  {
    path: 'modal-service',
    component: ModalServiceDocsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
