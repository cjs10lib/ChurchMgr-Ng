import { Person } from './../../../../models/person.model';
import { PeopleService } from './../../../../services/people.service';
import { SweetAlertService } from './../../../../services/sweet-alert.service';
import { PersonGroup } from './../../../../models/person-group.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PeopleGroupService } from '../../../../services/people-group.service';
import { Subscription } from '../../../../../../node_modules/rxjs';

@Component({
  selector: 'app-group-registry',
  templateUrl: './group-registry.component.html',
  styleUrls: ['./group-registry.component.scss']
})
export class GroupRegistryComponent implements OnInit, OnDestroy {

  pageTitle = 'Groups';
  pageIcon = '';

  searchQry: string;

  people: Person[];

  groups: PersonGroup[];
  filteredGroups: PersonGroup[];

  showSpinner = true;
  groupSubscription: Subscription;
  peopleSubscription: Subscription;

  constructor(private groupService: PeopleGroupService, private peopleService: PeopleService,
    private alertService: SweetAlertService) { }

  ngOnInit() {

    this.peopleSubscription = this.peopleService.getPeople().subscribe(resp => {
      this.people = resp;
    });

    this.groupSubscription = this.groupService.getGroups().subscribe(resp => {
      this.showSpinner = false;
      this.groups = this.filteredGroups = resp;
    });

  }

  ngOnDestroy(): void {
    if (this.groupSubscription) {
      this.groupSubscription.unsubscribe();
    }

    if (this.peopleSubscription) {
      this.peopleSubscription.unsubscribe();
    }
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
      p => p.name.toLowerCase().includes(qry.toLowerCase())) : this.groups;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
