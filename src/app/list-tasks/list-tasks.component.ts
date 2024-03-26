import { Component, OnInit } from '@angular/core';
import { TaskListService } from '../services/task-list.service';
import { TasksService } from '../services/tasks.service';
import { Task } from '../model/task';
import { Router } from '@angular/router';
import { AddTaskComponent } from '../add-task/add-task.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.css'],
})
export class ListTasksComponent implements OnInit {
  taskList: Task[] = [];
  filteredTasks: Task[] = [];
  completedTasks: Task[] = [];
  selectedPriority: string = 'all';
  searchQuery: string = '';

  constructor(
    private service: TaskListService,
    private taskService: TasksService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private stateService: StateService 
  ) {}

  ngOnInit(): void {
    this.getTaskList();

    // Subscribe to changes in selectedPriority
    this.taskService.selectedPriority$.subscribe((priority) => {
      console.log("Task LISt:"  + priority);
      this.selectedPriority = priority;
      this.filterTasksByPriorityAndSearch();
    });

    // Subscribe to changes in searchQuery
    this.taskService.searchQuery$.subscribe((query) => {
      this.searchQuery = query;
      this.filterTasksByPriorityAndSearch();
    });
  }

  onRadioChange(priority: string): void {
    this.selectedPriority = priority;
    console.log("Selected priority inside radio change method: "+this.selectedPriority);
    this.filterTasksByPriorityAndSearch();
  }

  onSearchQueryChange(searchQuery: string): void {
    this.searchQuery = searchQuery;
    this.filterTasksByPriorityAndSearch();
  }

  getTaskList() {
    this.service.getTaskList().subscribe({
      next: (data: Task[]) => {
        this.taskList = data;
        this.filterTasksByPriorityAndSearch();
        this.filterCompletedTasks();
      },
      error: (error) => {
        alert('Failed to Fetch Tasks Due to Server Error!!');
        this.router.navigateByUrl('/login');
      },
    });
  }

  private filterTasksByPriorityAndSearch(): void {
    let tempTasks = this.taskList;

    if (this.selectedPriority.toLowerCase() !== 'all') {
      console.log("inside if not all:"+this.selectedPriority);
      tempTasks = tempTasks.filter(task => task.taskPriority.toLowerCase() === this.selectedPriority.toLowerCase());
    }

    if (this.searchQuery) {
      const lowerCaseSearch = this.searchQuery.toLowerCase();
      tempTasks = tempTasks.filter(task =>
        task.taskTitle.toLowerCase().includes(lowerCaseSearch) ||
        task.taskContent.toLowerCase().includes(lowerCaseSearch)
      );
    }

    if (!this.searchQuery && this.selectedPriority.toLowerCase() === 'all') {
      // No search query and all priorities selected, show all tasks
      tempTasks = this.taskList;
    }

    tempTasks = tempTasks.filter(task => !task.complete);
    console.log(tempTasks);
    this.filteredTasks = tempTasks;
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '600px',
      data: { editMode: false, taskData: null }
    });

    dialogRef.componentInstance.addTask.subscribe((newTask: Task) => {
      // // Handle the emitted task and update the task list
      // newTask.taskId = this.taskList.length + 1
      // console.log(newTask.taskId);
      newTask.taskCreatedDate = this.formatDate(new Date())
      // console.log(newTask);
      this.onAddTask(newTask)
    });
  }
  onAddTask(taskData: any) {
    // Call the service to add the task
    this.service.addTask(taskData).subscribe(
      (response) => {
        console.log('Task added successfully:', response);
        console.log(taskData);
        // this.taskList.push(response);

        // Update the displayed tasks
        this.getTaskList();
      },
      (error) => {
        console.error('Error adding task:', error);
      }
    );
  }

  openEditTaskDialog(task: Task): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '600px',
      data: { editMode: true, taskData: task }
    });
    dialogRef.componentInstance.addTask.subscribe((editedTask: Task) => {
      // Handle the emitted edited task and update the task list
      editedTask.taskId = task.taskId
      this.onEditTask(editedTask);
    });
  }

  onEditTask(task: Task) {
    this.service.editTask(task).subscribe(
      (response) => {
        console.log('Task added successfully:', response);
        console.log(task);
        this.getTaskList();
      },
      (error) => {
        console.error('Error adding task:', error);
      }
    );
  }

  toggleAction(isHovered: boolean, task: Task) {
    task.hovered = isHovered;
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

  deleteTask(task:Task) {
    const userConfirmed = window.confirm('Are you sure you want to delete this task?');

    // Check user's confirmation
    if (!userConfirmed) {
      // User canceled, do nothing
      return;
    }

    this.service.deleteTask(task.taskId).subscribe(
      (response) => {
        console.log('Task deleted successfully:', response);

        // Update the taskList
        this.getTaskList();
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );
  }

  viewTask(task:Task) {
    this.taskService.setTask(task);
    const dialogRef = this.dialog.open(ViewTaskComponent, {
      width: '500px',
      height: '300px',
    });
  }

  archieveTask(task: Task) {
    this.service.archieveTask(task).subscribe(
      (response) => {
        console.log('Task archieved successfully:', response);

        // Update the taskList
        this.getTaskList(); 
        
        // Display a snackbar
        this.showSnackBar('Task archived successfully!');
        this.stateService.toggleArchive()
        this.router.navigateByUrl("/archived")
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  markAsCompleted(task: Task): void {
    const userConfirmed = window.confirm('Are you sure you want to mark this task as completed?');

    if (!userConfirmed) {
        return;
    }
    this.service.markTaskAsCompleted(task).subscribe(
      (response) => {
        console.log('Task marked successfully:', response);
        console.log(task);
        this.getTaskList();
      },
      (error) => {
        console.error('Error marking task:', error);
      }
    );
    console.log("After Service Called Successfully");
    // Move the completed task from taskList to completedTasks
    // this.completedTasks.push(task);
    // this.taskList = this.taskList.filter(task => !task.complete);

    // Update the displayed tasks
    // this.filterTasksByPriorityAndSearch();
  }

  // Add this method to filter completed tasks
  private filterCompletedTasks(): void {
    this.completedTasks = this.taskList.filter(task => task.complete);
  }
  // Utility function to format a date as dd/mm/yyyy
  private formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Note: Month is zero-based
  const year = String(date.getFullYear());

  return `${day}/${month}/${year}`;
};

}
