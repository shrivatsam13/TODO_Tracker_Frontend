import { Component } from '@angular/core';
import { TaskListService } from '../services/task-list.service';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-user-login-view',
  templateUrl: './user-login-view.component.html',
  styleUrls: ['./user-login-view.component.css']
})
export class UserLoginViewComponent {
  code: string = '';
  hidePassword: boolean = true;
  loginSuccess: boolean = false;

  user: User = {
    userId: 1,
    userName: "",
    userPassword: "Pass@12345",
    userEmail: "shrivatsam43@gmail.com"
  };

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  constructor(private taskListService: TaskListService, private router: Router, private authService: AuthService, private formBuilder: FormBuilder){}

  login(): void {
    console.log("Login clicked");
    // Call the login method of the TaskListService and pass the user object
    this.authService.login(this.user)
      .subscribe(
        (responseString) => {
          console.log('Login successful. Response:', responseString);
          // Use the 'responseString' to pass as token in 'response' variable
          this.taskListService.token = responseString;
          console.log("Fetching response variable from service:");
          this.authService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
            if (isLoggedIn) {
              this.loginSuccess = true;
            }
            else {
              this.loginSuccess = false;
            }
          });

          this.taskListService.getTaskList();
          this.router.navigateByUrl("/taskList")          
        },
        (error) => {
          console.error('Login failed:', error);
        }
      );
    
  }
}
