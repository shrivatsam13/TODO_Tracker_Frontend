import { Component } from '@angular/core';
import { TaskListService } from '../services/task-list.service';
import { User } from '../model/user'
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-register-view',
  templateUrl: './user-register-view.component.html',
  styleUrls: ['./user-register-view.component.css']
})
export class UserRegisterViewComponent {
  user: User = {
    userId: 0,
    userName: '',
    userPassword: '',
    userEmail: ''
  };

  onRegister: boolean = false;

  constructor(private taskListService: TaskListService, private router: Router) {}

  ngOnit(){
    this.onRegister = true;
  }

  onSubmit() {
    // Handle the form submission logic here
    console.log('Form submitted:', this.user);
    // Add your authentication logic, API calls, etc.
    this.taskListService.registerUser(this.user).subscribe(
      (any) => {
        alert('User registered successfully, proceed to login')
        this.router.navigateByUrl("/login")          
      },
      (error) => {
        console.error('Register failed:', error);
        alert("It looks like you already have an account with us, proceed to login")
        this.router.navigateByUrl('/login')
      }
    )
  }

  // login(): void {
  //   // Call the login method of the TaskListService and pass the user object
  //   this.authService.login(this.user)
  //     .subscribe(
  //       (responseString) => {
  //         this.service.response = responseString;

  //         this.authService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
  //           if (isLoggedIn) {
  //             this.loginSuccess = true;
  //           }
  //           else {
  //             this.loginSuccess = false;
  //           }
  //         });

  //         this.service.getTaskList();
  //         this.router.navigateByUrl("/taskList")          
  //       },
  //       (error) => {
  //         console.error('Login failed:', error);
  //       }
  //     );
  // }

}
