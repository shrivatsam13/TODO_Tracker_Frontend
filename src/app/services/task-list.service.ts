import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from '../model/user';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {
  baseUrl: string = "http://localhost:9003/api/v2/"

  taskList: Observable<Task[]> | undefined;

  token: string = ""

  constructor(private http: HttpClient) { }

  addTask(task: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.post(this.baseUrl + "user/task", task, { headers });
  }

  editTask(task: Task): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.put(this.baseUrl + "user/updateTask", task, { headers });
  }

  deleteTask(taskId: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.delete(this.baseUrl + "user/task/" + taskId, { headers });
  }

  archieveTask(task: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.post(this.baseUrl + "user/archiveTask", task, { headers });
  }

  unarchieveTask(task: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.post(this.baseUrl + "user/unarchiveTask", task, { headers });
  }

  markTaskAsCompleted(task: Task): Observable<any> {
    console.log("Service method called");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.put(this.baseUrl + "user/markTaskAsCompleted/" + task.taskId, {} ,{ headers });
  }

  getTaskList(): Observable<Task[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    this.taskList = this.http.get<Task[]>(this.baseUrl + "user/tasks", { headers })
    return this.taskList
  }

  getArchivedTaskList(): Observable<Task[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.taskList = this.http.get<Task[]>(this.baseUrl + "user/archivedTaskList", { headers })
    return this.taskList
  }

  registerUser(user: User): Observable<any> {
    return this.http.post<string>(this.baseUrl + "/register", user)
      .pipe(
        catchError((error) => {
          return throwError('Register failed. Please try again.');
        })
      );
  }

}
