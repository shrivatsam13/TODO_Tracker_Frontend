// tasks.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private allTasks: Task[] = [];

  private viewTask = new BehaviorSubject<Task[]>([]);
  task$ = this.viewTask.asObservable();

  private filteredTasksSource = new BehaviorSubject<Task[]>([]);
  filteredTasks$ = this.filteredTasksSource.asObservable();

  private searchQuerySource = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySource.asObservable();

  constructor(private http: HttpClient) {}

  reset(): void {
    this.selectedPriority$ = new BehaviorSubject<string>('all');
  }

  private selectedPrioritySource = new BehaviorSubject<string>('all');
  selectedPriority$ = this.selectedPrioritySource.asObservable();

  setTask(task: Task) {
    this.viewTask.next([task]);
  }

  setSelectedPriority(priority: string) {
    this.selectedPrioritySource.next(priority);
    console.log("TaskService: " + priority);
    this.filterTasksByPriority(priority);
  }

  filterTasksByPriority(priority: string) {
    if (priority === 'all') {
      this.filteredTasksSource.next([...this.allTasks]);
    } else {
      const filteredTasks = this.allTasks.filter(task => task.taskPriority === priority);
      this.filteredTasksSource.next(filteredTasks);
    }
  }


  setSearchQuery(query: string) {
    this.searchQuerySource.next(query);
    this.filterTasksBySearch(query);
  }

  filterTasksBySearch(query: string) {
    // Implement the logic to filter tasks based on the search query
    // For example, you can filter tasks by task title or task content
    const filteredTasks = this.allTasks.filter(task =>
      task.taskTitle.toLowerCase().includes(query.toLowerCase()) ||
      task.taskContent.toLowerCase().includes(query.toLowerCase())
    );
    this.filteredTasksSource.next(filteredTasks);
  }

}
