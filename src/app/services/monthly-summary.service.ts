import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MonthlySummary } from '../models/monthly-summary.model';
import { ConvertTimestampService } from './convert-timestamp.service';

@Injectable({
  providedIn: 'root'
})
export class MonthlySummaryService {

  private summaryCollection: AngularFirestoreCollection<MonthlySummary>;
  private summaries: Observable<MonthlySummary[]>;

  constructor(private db: AngularFirestore, private timestampService: ConvertTimestampService) { 
    this.summaryCollection = db.collection('giving-summary');

    this.summaries = this.summaryCollection.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as MonthlySummary;
          data.id = a.payload.doc.id;

          return data;
        })
      })
    );
  }

  private async givingSummaryCheck(docId) {    
    const doc = await this.db.doc(`giving-summary/${docId}`).ref.get();
    const data = doc.data() as MonthlySummary;

    return doc.exists ? data : null;
  }

  private getGivingSummaryId(givingDate: Date) {
    const givingYear = (givingDate.toLocaleDateString('en', { year: 'numeric' }));
    const givingMonth = (givingDate.toLocaleDateString('en', { month: 'long' }));

    return { docId: givingYear + '-' + givingMonth, month: givingMonth };
  }

  getGivingSummary() {
    return this.summaries;
  }

  async addOrUpdateSummary(givingDate: Date, amount: number) {
    let docId = this.getGivingSummaryId(givingDate).docId;
    let docMonth = this.getGivingSummaryId(givingDate).month;

    //verify if record exists
    let isExist = await this.givingSummaryCheck(docId);

    if (isExist) {
      // update existing
      return this.db.doc(`giving-summary/${docId}`)
        .set({ month: docMonth, total: isExist.total + amount, lastUpdate: this.timestampService.getTimestamp // sets server timestamp
      }, { merge: true });
    }

    // create new
    return this.db.doc(`giving-summary/${docId}`)
      .set({ month: docMonth, total: amount, lastUpdate: this.timestampService.getTimestamp // sets server timestamp
    }, { merge: true });
  }
}


