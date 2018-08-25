import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-registry-list',
  templateUrl: './group-registry-list.component.html',
  styleUrls: ['./group-registry-list.component.scss']
})
export class GroupRegistryListComponent implements OnInit {

  pageTitle = 'Groups';
  pageIcon = '';

  parentComponent = 'group-registry';
  showControls = true;

  constructor() { }

  ngOnInit() {
  }

}
