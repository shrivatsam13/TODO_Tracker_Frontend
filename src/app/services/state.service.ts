// state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private showArchivedSource = new BehaviorSubject<boolean>(true);
  showArchived$ = this.showArchivedSource.asObservable();

  toggleArchive() {
    const currentValue = this.showArchivedSource.value;
    this.showArchivedSource.next(!currentValue);
  }
}
