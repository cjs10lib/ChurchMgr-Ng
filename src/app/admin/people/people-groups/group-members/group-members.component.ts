import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { GroupMember } from '../../../../models/person-group.model';
import { PeopleGroupService } from '../../../../services/people-group.service';
import { PeopleService } from '../../../../services/people.service';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { UploadService } from '../../../../services/upload.service';
import { GroupMembersAddComponent } from './../group-members-add/group-members-add.component';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss']
})
export class GroupMembersComponent implements OnInit, OnDestroy {

  pageTitle = 'Group Members ';
  pageIcon = '';

  editState = false;
  roleToEdit: GroupMember;

  roles = [
    { displayName: 'Admin', value: 'ADMIN' },
    { displayName: 'Member', value: 'MEMBER' },
    { displayName: 'Leader', value: 'LEADER' },
  ];

  searchQry: string;

  groupId: string;

  people = [];
  peopleId = [];
  filteredPeople = [];

  showSpinner = true;
  subscription: Subscription;
  peopleSubscription: Subscription;
  avatarSubscription: Subscription;

  constructor(private peopleGroupService: PeopleGroupService,
    private peopleService: PeopleService,
    private uploadService: UploadService,
    private dialog: MatDialog, private route: ActivatedRoute,
    private alertService: SweetAlertService) { }

  ngOnInit() {

    this.groupId = this.route.snapshot.paramMap.get('id');

    this.subscription = this.peopleGroupService.getGroupMembers(this.groupId).subscribe(resp => {
      this.showSpinner = false;
      const groupMembers = resp;

      this.people = this.filteredPeople = [];

      groupMembers.forEach(object => {

        // get people object
        this.peopleSubscription = this.peopleService.getPerson(object.personId).subscribe(person => {

          // get people avatar
          this.avatarSubscription = this.uploadService.getProfileImage(person.profileImage).subscribe(result => {

            this.people.push({ // for each people record, set person data and avatar
              id: object.personId,
              role:  object.role,
              avatar: result,
              data: person
            });

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

    if (this.peopleSubscription) {
      this.peopleSubscription.unsubscribe();
    }

    if (this.avatarSubscription) {
      this.avatarSubscription.unsubscribe();
    }
  }

  addGroupMembers() {

    this.dialog.open(GroupMembersAddComponent, {
      height: '800px',
      width: '1000px',
      data: {
        groupId: this.groupId,
        people: this.people
      }
    });
  }

  clearEditState() {
    this.editState = false;
    this.roleToEdit = null;
  }

  editPersonRole(event, memberRole) {
    this.editState = true;
    this.roleToEdit = memberRole;
  }

  async updateMemberRole() {
    const confirm = await this.alertService.confirmUpdate();
    if (confirm.value) {
      await this.peopleGroupService.updateGroupMember(this.roleToEdit, this.groupId);

      this.alertService.afterUpdateSuccess();
      this.clearEditState();
    }
  }

  async deleteFromGroup(personId: string) {
    const confirm = await this.alertService.confirmDelete();
    if (confirm.value) {
      await this.peopleGroupService.deleteGroupMember(personId, this.groupId);
      this.alertService.afterDeleteSuccess();
    }
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
