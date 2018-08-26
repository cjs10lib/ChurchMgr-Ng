import { GivingGeneralComponent } from './admin/people/people-giving/giving-report-general/giving-general/giving-general.component';
import { PeopleBasicFormComponent } from './admin/people/people-registration/people-basic-form/people-basic-form.component';
import { GivingDemographicsComponent } from './admin/people/people-giving/giving-report-general/giving-demographics/giving-demographics.component';
import { GivingBatchesComponent } from './admin/people/people-giving/giving-report-general/giving-batches/giving-batches.component';
import { GivingIndividualComponent } from './admin/people/people-giving/giving-report-general/giving-individual/giving-individual.component';
import { GivingReportGeneralComponent } from './admin/people/people-giving/giving-report-general/giving-report-general.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginFormComponent } from './admin/authentication/login-form/login-form.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import {
  FamilyMembersRegistryComponent,
} from './admin/people/people-family/family-members-registry/family-members-registry.component';
import { FamilyProfileComponent } from './admin/people/people-family/family-profile/family-profile.component';
import { FamilyRegistryComponent } from './admin/people/people-family/family-registry/family-registry.component';
import { PeopleGalleryComponent } from './admin/people/people-gallery/people-gallery.component';
import { GivingCategoriesComponent } from './admin/people/people-giving/giving-categories/giving-categories.component';
import { GivingFormComponent } from './admin/people/people-giving/giving-form/giving-form.component';
import { GroupFormComponent } from './admin/people/people-groups/group-form/group-form.component';
import { GroupMembersComponent } from './admin/people/people-groups/group-members/group-members.component';
import { GroupRegistryListComponent } from './admin/people/people-groups/group-registry-list/group-registry-list.component';
import { PeopleProfileBioComponent } from './admin/people/people-profile/people-profile-bio/people-profile-bio.component';
import { PeopleProfileComponent } from './admin/people/people-profile/people-profile.component';
import { ProfileEditComponent } from './admin/people/people-profile/profile-edit/profile-edit.component';
import { PeopleRegistrationComponent } from './admin/people/people-registration/people-registration.component';
import { PeopleRegistryComponent } from './admin/people/people-registry/people-registry.component';
import { VisitorProfileComponent } from './admin/people/people-visitors/visitor-profile/visitor-profile.component';
import { VisitorsFormComponent } from './admin/people/people-visitors/visitors-form/visitors-form.component';
import { VisitorsRegistryComponent } from './admin/people/people-visitors/visitors-registry/visitors-registry.component';
import { TransactionsComponent } from './admin/transactions/transactions.component';
import { HomeComponent } from './general/home/home.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthenticationLayoutComponent } from './layouts/authentication-layout/authentication-layout.component';
import { GeneralLayoutComponent } from './layouts/general-layout/general-layout.component';
import { GivingReportPersonComponent } from './admin/people/people-giving/giving-report-person/giving-report-person.component';
import { GivingOverviewComponent } from './admin/people/people-giving/giving-report-general/giving-overview/giving-overview.component';
import { GivingAnonymousComponent } from './admin/people/people-giving/giving-report-general/giving-anonymous/giving-anonymous.component';

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
        component: PeopleProfileComponent,
        children: [
          {
            path: 'profile-bio',
            component: PeopleProfileBioComponent
          },
          {
            path: 'profile-Edit',
            component: ProfileEditComponent
          },
          {
            path: 'profile-gallery',
            component: PeopleGalleryComponent
          },
          {
            path: 'family-members',
            component: FamilyMembersRegistryComponent
          },
          {
            path: 'profile-giving',
            component: GivingReportPersonComponent
          }
        ]
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
        path: 'visitors',
        component: VisitorsRegistryComponent
      }, {
        path: 'visitors-registration',
        component: VisitorsFormComponent
      }, {
        path: 'visitors-registration/:id',
        component: VisitorsFormComponent
      }, {
        path: 'visitor-profile/:id',
        component: VisitorProfileComponent
      }, {
        path: 'groups',
        component: GroupRegistryListComponent
      }, {
        path: 'group-registration',
        component: GroupFormComponent
      }, {
        path: 'group-registration/:id',
        component: GroupFormComponent
      }, {
        path: 'group-members/:id',
        component: GroupMembersComponent
      }, {
        path: 'giving-categories',
        component: GivingCategoriesComponent
      }, {
        path: 'giving',
        component: GivingFormComponent
      }, {
        path: 'giving-report',
        component: GivingReportGeneralComponent,
        children: [
          {
            path: 'overview',
            component: GivingOverviewComponent
          }, {
            path: 'individual',
            component: GivingIndividualComponent
          }, {
            path: 'anonymous',
            component: GivingAnonymousComponent
          }, {
            path: 'general',
            component: GivingGeneralComponent
          }, {
            path: 'batches',
            component: GivingBatchesComponent
          }, {
            path: 'demographics',
            component: GivingDemographicsComponent
          }
        ]
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
