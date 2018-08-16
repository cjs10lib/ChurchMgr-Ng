import { ActivatedRoute } from '@angular/router';
import { GroupMember } from './../../../../models/person-group.model';
import { PeopleGroupService } from './../../../../services/people-group.service';
import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { PeopleService } from './../../../../services/people.service';
import { UploadService } from './../../../../services/upload.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '../../../../../../node_modules/@angular/material';

@Component({
  selector: 'app-group-members-add',
  templateUrl: './group-members-add.component.html',
  styleUrls: ['./group-members-add.component.scss']
})
export class GroupMembersAddComponent implements OnInit, OnDestroy {

  searchQry: string;

  selectedPeopleChecked = [];
  showPeopleList = false;

  groupMembersId = [];
  groupMember: GroupMember = {};

  peopleToDisplay = [];

  people = [];
  filteredPeople = [];
  nonGroupMembers = [];

  showSpinner = true;
  subscription: Subscription;

  constructor(private peopleService: PeopleService, private uploadService: UploadService,
    private groupService: PeopleGroupService, @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<GroupMembersAddComponent>) {}

  ngOnInit() {

    this.subscription = this.peopleService.getPeople().subscribe(resp => {
      this.showSpinner = false;

      resp.forEach(object => {
        this.uploadService.getProfileImage(object.profileImage).pipe(take(1)).subscribe(result => {


          this.people.push({ // for each people record, set person data and avatar
            id: object.id,
            avatar: result,
            data: object
          });

        });
      });
    });

    // get only groupMembersId from group
    this.data['people'].forEach(element => {
      this.groupMembersId.push(element.id);
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  comparer(people, groupMembers) {

    const newArr = [];

    people.forEach(object => {
      if (groupMembers.indexOf(object.id) === -1) {
        newArr.push(object);
      }
    });
    return newArr;
  }

  loadPeople() {
    this.showPeopleList = true;

    this.nonGroupMembers = this.filteredPeople = this.comparer(this.people, this.groupMembersId);
  }


  addToGroup() {
    if (this.selectedPeopleChecked.length > 0) {

      this.selectedPeopleChecked.forEach(async p => {
        this.groupMember.groupId = this.data.groupId;
        this.groupMember.personId = p['id'];

        await this.groupService.addMembersToGroup(this.groupMember);
      });

      this.dialogRef.close();
    }

  }

  search(qry: string) {

    this.filteredPeople = qry ?
    this.nonGroupMembers.filter(
      p => p.data.fullname.toLowerCase().includes(qry.toLowerCase())) : this.nonGroupMembers;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
