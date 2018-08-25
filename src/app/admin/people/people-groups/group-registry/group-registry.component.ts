import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeIn, fadeInDown, fadeInRight } from 'ng-animate';

import { Subscription } from '../../../../../../node_modules/rxjs';
import { PeopleGroupService } from '../../../../services/people-group.service';
import { PersonGroup } from './../../../../models/person-group.model';
import { Person } from './../../../../models/person.model';
import { PeopleService } from './../../../../services/people.service';
import { SweetAlertService } from './../../../../services/sweet-alert.service';

@Component({
  selector: 'app-group-registry',
  templateUrl: './group-registry.component.html',
  styleUrls: ['./group-registry.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    trigger('fadeInDown', [transition('* => *', useAnimation(fadeInDown, {params: { timing: 0.25, delay: 0 }}))]),
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight, {params: { timing: 0.75, delay: 0 }}))]),
  ],
})
export class GroupRegistryComponent implements OnInit, OnDestroy { 

  fadeIn: any;
  fadeInDown: any;
  fadeInRight: any;

  @Input() parentComponent: string;
  @Input() showControls: boolean;

  routeId: string;
  searchQry: string;

  people: Person[];

  groups = [];
  filteredGroups: PersonGroup[];

  showSpinner = true;
  groupSubscription: Subscription;
  peopleSubscription: Subscription;

  constructor(private groupService: PeopleGroupService,
    private peopleService: PeopleService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.peopleSubscription = this.peopleService.getPeople().subscribe(resp => {
      this.people = resp;
    });

    if (this.parentComponent === 'people-profile') {

      this.routeId = this.route.parent.snapshot.paramMap.get('id');
      return this.getGroupMembersFromPeopleProfile();

    } else {

      this.routeId = this.route.snapshot.paramMap.get('id');
      return this.getGroupMembersFromGroupProfile();

    }

  }

  ngOnDestroy(): void {
    if (this.groupSubscription) {
      this.groupSubscription.unsubscribe();
    }

    if (this.peopleSubscription) {
      this.peopleSubscription.unsubscribe();
    }
  }


  private getGroupMembersFromPeopleProfile() {
    this.groupSubscription = this.groupService.getGroupsByMember(this.routeId).subscribe(resp => {

      this.showSpinner = false;
      this.groups = this.filteredGroups = [];

      resp.forEach(object => {

        const groupId = object.groupId;

        this.groupService.getGroup(object.groupId).subscribe(group => {

          this.groups.push({
            groupId: groupId,
            data: group
          });

          this.filteredGroups = this.groups;

        });
      });
    });
  }

  private getGroupMembersFromGroupProfile() {
    this.groupSubscription = this.groupService.getGroups().subscribe(resp => {
      this.showSpinner = false;

      this.groups = this.filteredGroups = [];

      resp.forEach(object => {

        const groupId = object.Id;

          this.groups.push({
            groupId: groupId,
            data: object
          });

          this.filteredGroups = this.groups;

        });
      });
  }

  getGroupLeader(leaderId: string) {
    if (!leaderId) {
      return;
    }

    const index = this.people.findIndex(p => p.id === leaderId);
    return this.people[index].fullname;
  }

  async deleteGroup(groupId: string) {
    const record = await this.alertService.confirmDelete();
    if (record.value) {
      this.groupService.deleteGroup(groupId);

      this.alertService.afterDeleteSuccess();
    }
  }

  search(qry: string) {

    this.filteredGroups = qry ?
    this.groups.filter(
      p => p.data.name.toLowerCase().includes(qry.toLowerCase())) : this.groups;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
