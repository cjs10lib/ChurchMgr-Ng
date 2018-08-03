import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrum',
  templateUrl: './breadcrum.component.html',
  styleUrls: ['./breadcrum.component.scss']
})
export class BreadcrumComponent implements OnInit {

   @Input() pageTitle: string;
   @Input() pageIcon: string;

  constructor() { }

  ngOnInit() {
  }

}
