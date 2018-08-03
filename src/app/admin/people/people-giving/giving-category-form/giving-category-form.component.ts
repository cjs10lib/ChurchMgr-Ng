import { Component, OnInit } from '@angular/core';
import { GivingCategory } from '../../../../models/giving-category.model';

@Component({
  selector: 'app-giving-category-form',
  templateUrl: './giving-category-form.component.html',
  styleUrls: ['./giving-category-form.component.scss']
})
export class GivingCategoryFormComponent implements OnInit {

  category: GivingCategory = {};

  constructor() { }

  ngOnInit() {
  }

}
