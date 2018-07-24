import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-other-form',
  templateUrl: './other-form.component.html',
  styleUrls: ['./other-form.component.scss']
})
export class OtherFormComponent implements OnInit {

  @Input() personId: string;

  constructor() { }

  ngOnInit() {
  }

}
