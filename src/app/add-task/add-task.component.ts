import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Task } from '../model/task';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  @Output() addTask = new EventEmitter<any>();
  @Output() cancel = new EventEmitter();

  title: string = "Add New Task"
  buttonTitle: string = "Add"

  newTaskTitle: string = '';
  newTaskContent: string = '';
  newTaskPriority: string = 'Medium'; // Default priority
  newTaskReminderDateTime: Date = new Date(); // Default to null

  constructor(private router: Router, private dialogRef: MatDialogRef<AddTaskComponent>, @Inject(MAT_DIALOG_DATA) public data: { editMode: boolean, taskData: Task }) {
    if (data.editMode) {
      // Initialize form fields with the data for editing
      this.title = "Edit Task"
      this.buttonTitle = "Update"

      this.newTaskTitle = data.taskData.taskTitle;
      this.newTaskContent = data.taskData.taskContent;
      this.newTaskPriority = data.taskData.taskPriority;
      this.newTaskReminderDateTime = this.parseDateString(data.taskData.taskDueDate);
    }
  }

  // Method to handle adding a new task
  onAddTask() {
    const formattedDate = this.formatDate(this.newTaskReminderDateTime);
    if (this.newTaskTitle.trim() !== '' && this.newTaskContent.trim() !== '') {
      // Emit the new task data to the parent component
      this.addTask.emit({
        taskTitle: this.newTaskTitle,
        taskContent: this.newTaskContent,
        taskPriority: this.newTaskPriority,
        taskDueDate: formattedDate
      });
      // this.clearForm();
      this.dialogRef.close();
    }
  }

  // Method to handle canceling the operation
  onCancel() {
    this.clearForm();
    this.dialogRef.close(); // Close the dialog
    this.router.navigateByUrl("/taskList");
  }

  // Helper method to clear the form fields
  private clearForm() {
    this.newTaskTitle = '';
    this.newTaskContent = '';
    this.newTaskPriority = 'Medium';
    this.newTaskReminderDateTime = new Date();
  }

  // Method to filter previous dates in the mat-datepicker
  filterPreviousDates = (date: Date | null): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
    return date ? date >= currentDate : true; // Allow today's date
  }

  // formatDate(date: Date): string | null {
  //   return this.datePipe.transform(date, 'dd/MM/yyyy');
  // }

    // Utility function to format a date as dd/mm/yyyy
    private formatDate(date: Date): string {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Note: Month is zero-based
      const year = String(date.getFullYear());
    
      return `${day}/${month}/${year}`;
    };

    parseDateString(dateString: string): Date {
      const dateParts = dateString.split('/');
      if (dateParts.length === 3) {
        // Note: Months are zero-based in JavaScript, so we subtract 1 from the month value
        const year = parseInt(dateParts[2], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const day = parseInt(dateParts[0], 10);
    
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          return new Date(year, month, day);
        }
      }
    
      // If the format is not correct or parsing fails, return null
      return new Date();
    }
    
}
