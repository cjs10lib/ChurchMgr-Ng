import { trigger, transition, useAnimation } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { GroupMember } from '../../../../models/person-group.model';
import { PeopleGroupService } from '../../../../services/people-group.service';
import { PeopleService } from '../../../../services/people.service';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { UploadService } from '../../../../services/upload.service';
import { GroupMembersAddComponent } from './../group-members-add/group-members-add.component';
import { fadeIn, fadeInDown, fadeInRight } from 'ng-animate';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    trigger('fadeInDown', [transition('* => *', useAnimation(fadeInDown, {params: { timing: 0.25, delay: 0 }}))]),
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight, {params: { timing: 0.75, delay: 0 }}))]),
  ],
})
export class GroupMembersComponent implements OnInit, OnDestroy, AfterViewInit {

  fadeIn: any;
  fadeInDown: any;
  fadeInRight: any;

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

  peopleId = [];
  people: any[] = [];
  filteredPeople: any[] = [];

  showSpinner = true;
  subscription: Subscription;
  peopleSubscription: Subscription;
  avatarSubscription: Subscription;
  addGroupMembersSubscription: Subscription;

  constructor(private peopleGroupService: PeopleGroupService,
    private peopleService: PeopleService,
    private uploadService: UploadService,
    private dialog: MatDialog, private route: ActivatedRoute,
    private alertService: SweetAlertService) { }

  ngOnInit() {

    this.groupId = this.route.snapshot.paramMap.get('id');

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

    if (this.addGroupMembersSubscription) {
      this.addGroupMembersSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.getPeople();
  }

  getPeople() {
    this.subscription = this.peopleGroupService.getGroupMembers(this.groupId).subscribe(resp => {
      this.showSpinner = false;

      this.people = [];
      this.filteredPeople = [];

      const temp = [];

      // const newwList =  Array.from(new Set(resp));

      resp.forEach(object => {

        // get people object
        this.peopleSubscription = this.peopleService.getPerson(object.personId).subscribe(person => {

          // get people avatar
          this.avatarSubscription = this.uploadService.getProfileImage(person.profileImage).subscribe(result => {

            // for each people record, set person data and avatar
            this.people.push({
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

  addGroupMembers() {

    // return this.ngOnInit();

    this.addGroupMembersSubscription = this.dialog.open(GroupMembersAddComponent, {
      height: '800px',
      width: '1000px',
      data: {
        groupId: this.groupId,
        people: this.people
      }
    }).afterClosed().subscribe(resp => {
      return this.ngOnInit();
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
      this.clearEditState();
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
