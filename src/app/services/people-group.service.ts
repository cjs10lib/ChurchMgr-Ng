import { PeopleService } from './people.service';
import { ConvertTimestampService } from './convert-timestamp.service';
import { Observable, merge } from 'rxjs';
import { PersonGroup, GroupMember } from './../models/person-group.model';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { map } from '../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeopleGroupService {

  private groupCollection: AngularFirestoreCollection<PersonGroup>;
  private groups$: Observable<PersonGroup[]>;

  constructor(private db: AngularFirestore, private timestampService: ConvertTimestampService) {
    this.groupCollection = db.collection('groups');

    this.groups$ = this.groupCollection.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as PersonGroup;
          data.Id = a.payload.doc.id;

          return data;
        });
      }
    ));
  }

  getGroups() {
    return this.groups$;
  }

  getGroup(groupId: string): Observable<PersonGroup> {
    return this.db.doc(`groups/${groupId}`).valueChanges();
  }

  addGroup(group: PersonGroup) {
    group.updatedAt = this.timestampService.getTimestamp;

    return this.groupCollection.add(group);
  }

  updateGroup(groupId: string, group: PersonGroup) {
    return this.db.doc(`groups/${groupId}`).set(group, {merge: true});
  }

  deleteGroup(groupId: string) {
    return this.db.doc(`groups/${groupId}`).delete();
  }

  // group members

  getGroupMembers(groupId: string) {
    const groupMembers = this.db.collection('group-members', ref => ref.where('groupId', '==', groupId));
    return groupMembers.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as GroupMember;
          data.Id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getGroupsByMember(personId: string) {
    const groups = this.db.collection('group-members', ref => ref.where('personId', '==', personId));
    return groups.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as GroupMember;
          data.Id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  addMembersToGroup(groupMember: GroupMember) {
    // generate custom groupMemberId for easy querying
    const cusGroupMemberId = groupMember.groupId + '_' + groupMember.personId;

    groupMember.role = 'MEMBER';
    groupMember.updatedAt = this.timestampService.getTimestamp;
    return this.db.collection('group-members').doc(cusGroupMemberId).set(groupMember);
  }

  updateGroupMember(groupMember, groupId: string) {
    const groupMemberId = groupId + '_' + groupMember.id;

    groupMember.updatedAt = this.timestampService.getTimestamp;
    return this.db.collection('group-members').doc(groupMemberId).set({ role: groupMember.role }, { merge: true });
  }

  deleteGroupMember(personId: string, groupId: string) {
    // custom generated id during adding to group
    const groupMemberId = groupId + '_' + personId;
    return this.db.doc(`group-members/${groupMemberId}`).delete();
  }

}
