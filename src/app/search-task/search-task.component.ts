import { Component, EventEmitter, Output } from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-search-task',
  templateUrl: './search-task.component.html',
  styleUrls: ['./search-task.component.css']
})

export class SearchTaskComponent {
  searchQuery: string = '';
  selectedPriority: string = 'all';
  showCompleted: boolean = true;

  @Output() searchEvent = new EventEmitter<string>();
  @Output() priorityChangeEvent = new EventEmitter<string>();

  constructor(private taskService: TasksService, public stateService: StateService) {
    this.stateService.showArchived$.subscribe((value) => {
      this.showCompleted = value;
    });
  }

  search(): void {
    console.log('Search query:', this.searchQuery);
    this.taskService.setSelectedPriority(this.selectedPriority);
    this.taskService.setSearchQuery(this.searchQuery); // Update the search query in the service
    this.searchEvent.emit(this.searchQuery);
  }

  onPriorityChange(priority: string): void {
    console.log("OnRadioCLick");
    this.selectedPriority = priority;
    this.taskService.setSelectedPriority(this.selectedPriority);
    this.priorityChangeEvent.emit(this.selectedPriority); // Emit the selected priority to the parent component
  }

}
