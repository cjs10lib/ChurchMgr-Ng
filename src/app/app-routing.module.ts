import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginFormComponent } from './admin/authentication/login-form/login-form.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { FamilyProfileComponent } from './admin/people/people-family/family-profile/family-profile.component';
import { FamilyRegistryComponent } from './admin/people/people-family/family-registry/family-registry.component';
import { GivingCategoriesComponent } from './admin/people/people-giving/giving-categories/giving-categories.component';
import { PeopleProfileComponent } from './admin/people/people-profile/people-profile.component';
import { PeopleRegistrationComponent } from './admin/people/people-registration/people-registration.component';
import { PeopleRegistryComponent } from './admin/people/people-registry/people-registry.component';
import { TransactionsComponent } from './admin/transactions/transactions.component';
import { HomeComponent } from './general/home/home.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthenticationLayoutComponent } from './layouts/authentication-layout/authentication-layout.component';
import { GeneralLayoutComponent } from './layouts/general-layout/general-layout.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      }
    ]
  }, {
    path: '',
    component: AuthenticationLayoutComponent,
    children: [
      {
        path: 'auth/login',
        component: LoginFormComponent
      }
    ]
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      }, {
        path: 'people-profile/:id',
        component: PeopleProfileComponent
      }, {
        path: 'people',
        component: PeopleRegistryComponent
      }, {
        path: 'people-registration',
        component: PeopleRegistrationComponent
      }, {
        path: 'family-profile/:id',
        component: FamilyProfileComponent
      }, {
        path: 'families',
        component: FamilyRegistryComponent
      }, {
        path: 'giving-categories',
        component: GivingCategoriesComponent
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
