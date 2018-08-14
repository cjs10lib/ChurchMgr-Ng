import { ActivatedRoute } from '@angular/router';
import { GroupMembersAddComponent } from './../group-members-add/group-members-add.component';
import { MatDialog } from '@angular/material';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { PeopleService } from '../../../../services/people.service';
import { UploadService } from '../../../../services/upload.service';
import { PeopleGroupService } from '../../../../services/people-group.service';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss']
})
export class GroupMembersComponent implements OnInit, OnDestroy {

  pageTitle = 'Group Members ';
  pageIcon = '';

  searchQry: string;

  groupId: string;

  people = [];
  peopleId = [];
  filteredPeople = [];

  showSpinner = true;
  subscription: Subscription;

  constructor(private peopleGroupService: PeopleGroupService,
    private peopleService: PeopleService,
    private uploadService: UploadService,
    private dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit() {

    this.groupId = this.route.snapshot.paramMap.get('id');

    this.subscription = this.peopleGroupService.getGroupMembers(this.groupId).subscribe(resp => {
      this.showSpinner = false;
      const groupMembers = resp;

      groupMembers.forEach(object => {
        // get people object
        this.peopleService.getPerson(object.personId).pipe(take(1)).subscribe(person => {

          // get people avatar
          this.uploadService.getProfileImage(person.profileImage).pipe(take(1)).subscribe(result => {

            this.people.push({ // for each people record, set person data and avatar
              id: object.personId,
              avatar: result,
              data: person
            });

            // this.people.forEach(p => {
            //   this.peopleId.push(p.id);
            // });

            this.filteredPeople = this.people;

          });

        });
      });
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  addGroupMembers() {
    // console.log(this.peopleId);

    this.dialog.open(GroupMembersAddComponent, {
      height: '800px',
      width: '1000px',
      data: {
        groupId: this.groupId,
        people: this.people
      }
    });
  }

  search(qry: string) {

    this.filteredPeople = qry ?
    this.people.filter(
      p => p.data.fullname.toLowerCase().includes(qry.toLowerCase())) : this.people;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
