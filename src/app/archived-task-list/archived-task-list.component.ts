import { Component, OnInit } from '@angular/core';
import { Task } from '../model/task';
import { TaskListService } from '../services/task-list.service';
import { TasksService } from '../services/tasks.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { AddTaskComponent } from '../add-task/add-task.component';

@Component({
  selector: 'app-archived-task-list',
  templateUrl: './archived-task-list.component.html',
  styleUrls: ['./archived-task-list.component.css']
})
export class ArchivedTaskListComponent implements OnInit {
  taskList: Task[] = [];
  filteredTasks: Task[] = [];
  showAddNote: boolean = false;
  selectedPriority: string = 'all'; // Default value
  searchQuery: string = '';

  constructor(private service: TaskListService, private taskService: TasksService,
    public dialog: MatDialog, private snackBar: MatSnackBar, private router: Router, public stateService: StateService) {}

  ngOnInit(): void {
    this.getTaskList();
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

  private filterTasksByPriorityAndSearch(): void {
    let filteredTasks = this.taskList;

    if (this.selectedPriority.toLowerCase() !== 'all') {
      console.log("inside if not all:"+this.selectedPriority);
      filteredTasks = filteredTasks.filter(task => task.taskPriority.toLowerCase() === this.selectedPriority.toLowerCase());
    }

    if (this.searchQuery) {
      const lowerCaseSearch = this.searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.taskTitle.toLowerCase().includes(lowerCaseSearch) ||
        task.taskContent.toLowerCase().includes(lowerCaseSearch)
      );
    }

    if (!this.searchQuery && this.selectedPriority === 'all') {
      // No search query and all priorities selected, show all tasks
      filteredTasks = this.taskList;
    }

    this.filteredTasks = filteredTasks;
  }

  private getTaskList(): void {
    this.service.getArchivedTaskList().subscribe({
      next: (data: Task[]) => {
        this.taskList = data;
        this.filterTasksByPriorityAndSearch();
      },
      error: (error) => {
        alert('Failed to Fetch Tasks Due to Server Error!!');
      },
      complete: () => console.info('complete')
    });
  }

  toggleAddNote(): void {
    this.showAddNote = !this.showAddNote;
  }

  toggleAction(isHovered: boolean, task: Task): void {
    task.hovered = isHovered;
  }

  getPriorityBackgroundColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'lightgreen'; // Set your desired background color for low priority
      case 'medium':
        return 'orange'; // Set your desired background color for medium priority
      case 'high':
        return 'red'; // Set your desired background color for high priority
      default:
        return ''; // Default background color if priority doesn't match any case
    }
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

  viewTask(task:Task) {
    this.taskService.setTask(task);
    const dialogRef = this.dialog.open(ViewTaskComponent, {
      width: '500px',
      height: '300px',
    });
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

  unarchieveTask(task: Task) {
    this.service.unarchieveTask(task).subscribe(
      (response) => {
        console.log('Task unarchieved successfully:', response);

        // Update the taskList
        this.getTaskList(); 

        // Display a snackbar
        this.showSnackBar('Task unarchived successfully!');
        this.stateService.toggleArchive()
        this.router.navigateByUrl("/taskList")
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
  
}
