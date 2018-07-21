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

import { FormsModule } from '../../node_modules/@angular/forms';
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
import { environment } from '../environments/environment';

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
    HomeComponent
  ],
  imports: [
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
