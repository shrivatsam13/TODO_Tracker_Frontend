import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedTaskListComponent } from './archived-task-list.component';

describe('ArchivedTaskListComponent', () => {
  let component: ArchivedTaskListComponent;
  let fixture: ComponentFixture<ArchivedTaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivedTaskListComponent]
    });
    fixture = TestBed.createComponent(ArchivedTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
