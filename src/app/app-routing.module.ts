import { PeopleRegistrationComponent } from './admin/people/people-registration/people-registration.component';
import { PeopleRegistryComponent } from './admin/people/people-registry/people-registry.component';
import { TransactionsComponent } from './admin/transactions/transactions.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthenticationLayoutComponent } from './layouts/authentication-layout/authentication-layout.component';
import { GeneralLayoutComponent } from './layouts/general-layout/general-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeopleComponent } from './admin/people/people.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralLayoutComponent,
    children: []
  }, {
    path: '',
    component: AuthenticationLayoutComponent,
    children: []
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      }, {
        path: 'people',
        component: PeopleRegistryComponent
      }, {
        path: 'people-registration',
        component: PeopleRegistrationComponent
      }, {
        path: 'transaction',
        component: TransactionsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
