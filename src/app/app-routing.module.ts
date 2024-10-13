import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatatableGenericComponent } from './datatable-generic/datatable-generic.component';

const routes: Routes = [
  { path: '', redirectTo: '/datatable', pathMatch: 'full' },
  { path: 'datatable', component: DatatableGenericComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
