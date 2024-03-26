import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginViewComponent } from './user-login-view/user-login-view.component';
import { UserRegisterViewComponent } from './user-register-view/user-register-view.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ArchivedTaskListComponent } from './archived-task-list/archived-task-list.component';
import { ListTasksComponent } from './list-tasks/list-tasks.component';

const routes: Routes = [
  { path: "", component: UserLoginViewComponent },
  { path: "login", component: UserLoginViewComponent},
  { path: "register", component: UserRegisterViewComponent},
  { path: "taskList", component: ListTasksComponent},
  { path: "archived", component: ArchivedTaskListComponent},
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
