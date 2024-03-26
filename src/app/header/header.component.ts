// header.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StateService } from '../services/state.service';
import { Router } from '@angular/router';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  showArchived: boolean = true;

  constructor(private authService: AuthService, public stateService: StateService, private router: Router, public taskService: TasksService) {
    this.allowNavigation = true;

    this.authService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.stateService.showArchived$.subscribe((value) => {
      this.showArchived = value;
    });
  }

  logout() {
    this.authService.logout();
  }

  allowNavigation = true;

  isRegisterPage(): boolean {
    return this.router.url === '/register';
  }
}
