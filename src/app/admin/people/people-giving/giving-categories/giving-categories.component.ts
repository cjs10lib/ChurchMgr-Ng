import { GivingCategoryFormComponent } from './../giving-category-form/giving-category-form.component';
import { MatDialog } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { GivingCategory } from '../../../../models/giving-category.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonGivingCategoryService } from '../../../../services/person-giving-category.service';

@Component({
  selector: 'app-giving-categories',
  templateUrl: './giving-categories.component.html',
  styleUrls: ['./giving-categories.component.scss']
})
export class GivingCategoriesComponent implements OnInit, OnDestroy {

  pageTitle = 'Giving Categories';
  pageIcon = 'category';

  category: GivingCategory = {};
  categories$ = [];

  showSpinner = true;
  subscription: Subscription;

  constructor(private dialog: MatDialog, private givingCategoryService: PersonGivingCategoryService,
    private alertService: SweetAlertService) { }

  ngOnInit() {
    this.subscription = this.givingCategoryService.getGivingCategories().subscribe(resp => {
      this.categories$ = resp;
      this.showSpinner = false;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openDialog() {
    this.dialog.open(GivingCategoryFormComponent, {
      // height: '450px',
      width: '600px',
    }).afterClosed().subscribe(resp => {
      if (resp) {
        this.category = resp;

        this.onSubmit();
      }
    });
  }

  onSubmit() {
    this.alertService.confirmUpdate().then(resp => {
      if (resp.value) {
        this.givingCategoryService.addGivingCategories(this.category);

        this.alertService.afterUpdateSuccess();
      }
    });
  }

}


