import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { User } from '../model/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) {}

  // Define a subject to maintain logged in state across components
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  login(user:User): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text' as 'json', // Set the responseType to 'text'
    };
    this.isLoggedIn.next(true);
    return this.http.post<string>("http://localhost:9003/api/v1/login", user, httpOptions)
      .pipe(
        catchError((error) => {
          // Handle error here (e.g., log it, show a user-friendly message)
          console.error('Login failed:', error);
          return throwError('Login failed. Please try again.');
        })
      );
  }

  // Provide option to logout
  logout() {
    this.isLoggedIn.next(false);
  }
}
