import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { TextInputAutocompleteModule } from 'angular-text-input-autocomplete';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { polyfill as keyboardEventKeyPolyfill } from 'keyboardevent-key-polyfill';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { environment } from '../environments/environment';
import { AuthenticationComponent } from './admin/authentication/authentication.component';
import { LoginFormComponent } from './admin/authentication/login-form/login-form.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { FamilyFormAddComponent } from './admin/people/people-family/family-form-add/family-form-add.component';
import { FamilyFormComponent } from './admin/people/people-family/family-form/family-form.component';
import { FamilyMembersListComponent } from './admin/people/people-family/family-members-list/family-members-list.component';
import {
  FamilyMembersRegistryComponent,
} from './admin/people/people-family/family-members-registry/family-members-registry.component';
import { FamilyProfileComponent } from './admin/people/people-family/family-profile/family-profile.component';
import { FamilyRegistryComponent } from './admin/people/people-family/family-registry/family-registry.component';
import { PeopleFamilyComponent } from './admin/people/people-family/people-family.component';
import { PeopleGalleryComponent } from './admin/people/people-gallery/people-gallery.component';
import { GivingBatchFormComponent } from './admin/people/people-giving/giving-batch-form/giving-batch-form.component';
import { GivingBatchComponent } from './admin/people/people-giving/giving-batch/giving-batch.component';
import { GivingCategoriesComponent } from './admin/people/people-giving/giving-categories/giving-categories.component';
import {
  GivingCategoryFormComponent,
} from './admin/people/people-giving/giving-category-form/giving-category-form.component';
import {
  GivingFormFieldsComponent,
} from './admin/people/people-giving/giving-form/giving-form-fields/giving-form-fields.component';
import {
  GivingFormIntroComponent,
} from './admin/people/people-giving/giving-form/giving-form-intro/giving-form-intro.component';
import { GivingFormComponent } from './admin/people/people-giving/giving-form/giving-form.component';
import { PeopleGivingComponent } from './admin/people/people-giving/people-giving.component';
import { PeopleProfileComponent } from './admin/people/people-profile/people-profile.component';
import { ProfileBioExtComponent } from './admin/people/people-profile/profile-bio-ext/profile-bio-ext.component';
import { ProfileBioComponent } from './admin/people/people-profile/profile-bio/profile-bio.component';
import { ProfileEditComponent } from './admin/people/people-profile/profile-edit/profile-edit.component';
import { ProfileIntroComponent } from './admin/people/people-profile/profile-intro/profile-intro.component';
import { PeopleBasicFormComponent } from './admin/people/people-registration/people-basic-form/people-basic-form.component';
import {
  AllergyFormComponent,
} from './admin/people/people-registration/people-extended-form/allergy-form/allergy-form.component';
import {
  BaptismalFormComponent,
} from './admin/people/people-registration/people-extended-form/baptismal-form/baptismal-form.component';
import {
  DietaryNeedFormComponent,
} from './admin/people/people-registration/people-extended-form/dietary-need-form/dietary-need-form.component';
import { OtherFormComponent } from './admin/people/people-registration/people-extended-form/other-form/other-form.component';
import {
  PeopleExtendedFormComponent,
} from './admin/people/people-registration/people-extended-form/people-extended-form.component';
import { PeopleRegistrationComponent } from './admin/people/people-registration/people-registration.component';
import { PeopleRegistryComponent } from './admin/people/people-registry/people-registry.component';
import { PeopleVisitorsComponent } from './admin/people/people-visitors/people-visitors.component';
import {
  VisitorProfileBioExtComponent,
} from './admin/people/people-visitors/visitor-profile/visitor-profile-bio-ext/visitor-profile-bio-ext.component';
import {
  VisitorProfileBioComponent,
} from './admin/people/people-visitors/visitor-profile/visitor-profile-bio/visitor-profile-bio.component';
import { VisitorProfileComponent } from './admin/people/people-visitors/visitor-profile/visitor-profile.component';
import { VisitorsFormComponent } from './admin/people/people-visitors/visitors-form/visitors-form.component';
import { VisitorsRegistryComponent } from './admin/people/people-visitors/visitors-registry/visitors-registry.component';
import { PeopleComponent } from './admin/people/people.component';
import { TransactionsComponent } from './admin/transactions/transactions.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DropZoneDirective } from './directives/drop-zone.directive';
import { HomeComponent } from './general/home/home.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthenticationLayoutComponent } from './layouts/authentication-layout/authentication-layout.component';
import { BreadcrumComponent } from './layouts/breadcrum/breadcrum.component';
import { GeneralLayoutComponent } from './layouts/general-layout/general-layout.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';
import { PeopleGroupsComponent } from './admin/people/people-groups/people-groups.component';
import { GroupRegistryComponent } from './admin/people/people-groups/group-registry/group-registry.component';
import { GroupRegistrationComponent } from './admin/people/people-groups/group-registration/group-registration.component';
import { GroupFormComponent } from './admin/people/people-groups/group-form/group-form.component';


keyboardEventKeyPolyfill();

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
    PeopleGalleryComponent,
    FamilyMembersRegistryComponent,
    FamilyProfileComponent,
    FileSizePipe,
    FamilyMembersListComponent,
    PeopleGivingComponent,
    GivingFormComponent,
    GivingCategoriesComponent,
    BreadcrumComponent,
    GivingCategoryFormComponent,
    GivingBatchComponent,
    GivingBatchFormComponent,
    GivingFormIntroComponent,
    GivingFormFieldsComponent,
    PeopleVisitorsComponent,
    VisitorsFormComponent,
    VisitorsRegistryComponent,
    VisitorProfileComponent,
    VisitorProfileBioComponent,
    VisitorProfileBioExtComponent,
    PeopleGroupsComponent,
    GroupRegistryComponent,
    GroupRegistrationComponent,
    GroupFormComponent
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
    ModalGalleryModule,
    ReactiveFormsModule,

    TextInputAutocompleteModule,

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
    FamilyFormAddComponent,
    GivingCategoryFormComponent,
    GivingBatchComponent,
    VisitorsFormComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
