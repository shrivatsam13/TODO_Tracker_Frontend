import { Component, OnInit } from '@angular/core';
import { Task } from '../model/task';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent  implements OnInit{
  taskList: Task[] = [];

  constructor( private taskService: TasksService ) {}

  ngOnInit(): void {
       // Subscribe to changes in task
    this.taskService.task$.subscribe((task) => {
      this.taskList = task;
    });
  }

  getPriorityBackgroundColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'lightgreen';
      case 'medium':
        return 'orange';
      case 'high':
        return 'red';
      default:
        return '';
    }
  }
}
