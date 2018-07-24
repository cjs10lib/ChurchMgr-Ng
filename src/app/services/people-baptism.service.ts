import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { Baptism } from '../models/person-baptism.model';

@Injectable({
  providedIn: 'root'
})
export class PeopleBaptismService {

  constructor(private db: AngularFirestore) { }

  updatePersonBaptism(personId: string, baptism: Baptism) {
    return this.db.collection('baptism')
      .doc(personId).set(baptism);
  }

  getPersonBaptism(personId: string): Observable<Baptism> {
    return this.db.doc(`baptism/${personId}`).valueChanges();
  }
}
