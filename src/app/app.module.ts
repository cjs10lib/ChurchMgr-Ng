import { PeopleGalleryComponent } from './admin/people/people-gallery/people-gallery.component';
import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { PeopleProfileComponent } from './admin/people/people-profile/people-profile.component';
import { PeopleBasicFormComponent } from './admin/people/people-registration/people-basic-form/people-basic-form.component';
import { PeopleRegistrationComponent } from './admin/people/people-registration/people-registration.component';
import { PeopleRegistryComponent } from './admin/people/people-registry/people-registry.component';
import { PeopleComponent } from './admin/people/people.component';
import { TransactionsComponent } from './admin/transactions/transactions.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DropZoneDirective } from './directives/drop-zone.directive';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthenticationLayoutComponent } from './layouts/authentication-layout/authentication-layout.component';
import { GeneralLayoutComponent } from './layouts/general-layout/general-layout.component';
import { AuthenticationComponent } from './admin/authentication/authentication.component';
import { LoginFormComponent } from './admin/authentication/login-form/login-form.component';
import { HomeComponent } from './general/home/home.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { environment } from '../environments/environment';
import { ProfileIntroComponent } from './admin/people/people-profile/profile-intro/profile-intro.component';
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';
import { ProfileBioComponent } from './admin/people/people-profile/profile-bio/profile-bio.component';
import { ProfileBioExtComponent } from './admin/people/people-profile/profile-bio-ext/profile-bio-ext.component';
import { ProfileEditComponent } from './admin/people/people-profile/profile-edit/profile-edit.component';
import { PeopleExtendedFormComponent } from './admin/people/people-registration/people-extended-form/people-extended-form.component';
import { BaptismalFormComponent } from './admin/people/people-registration/people-extended-form/baptismal-form/baptismal-form.component';
import { FamilyFormComponent } from './admin/people/people-family/family-form/family-form.component';
import { FamilyFormAddComponent } from './admin/people/people-family/family-form-add/family-form-add.component';
import { OtherFormComponent } from './admin/people/people-registration/people-extended-form/other-form/other-form.component';
// tslint:disable-next-line:max-line-length
import { DietaryNeedFormComponent } from './admin/people/people-registration/people-extended-form/dietary-need-form/dietary-need-form.component';
import { AllergyFormComponent } from './admin/people/people-registration/people-extended-form/allergy-form/allergy-form.component';
import { PeopleFamilyComponent } from './admin/people/people-family/people-family.component';
import { FamilyRegistryComponent } from './admin/people/people-family/family-registry/family-registry.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    GeneralLayoutComponent,
    AuthenticationLayoutComponent,
    DashboardComponent,
    PeopleComponent,
    TransactionsComponent,
    PeopleRegistryComponent,
    PeopleRegistrationComponent,
    PeopleProfileComponent,
    PeopleBasicFormComponent,
    DropZoneDirective,
    AuthenticationComponent,
    LoginFormComponent,
    HomeComponent,
    ProfileIntroComponent,
    LoadingSpinnerComponent,
    ProfileBioComponent,
    ProfileBioExtComponent,
    ProfileEditComponent,
    PeopleExtendedFormComponent,
    BaptismalFormComponent,
    FamilyFormComponent,
    FamilyFormAddComponent,
    OtherFormComponent,
    DietaryNeedFormComponent,
    AllergyFormComponent,
    PeopleFamilyComponent,
    FamilyRegistryComponent,
    PeopleGalleryComponent
  ],
  imports: [
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),

    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    LayoutModule,
    PerfectScrollbarModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule
  ],
  entryComponents: [
    FamilyFormAddComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
