import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { AssignmentsService } from './assignments.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  loggedIn:boolean = false;
  
  constructor(private http: HttpClient) { }

  logIn(username:string, pwd:string) {
    return this.http.post<any>(environment.url + 'user', {
      "username": username,
      "pwd": pwd })
      .pipe(map(data => {
        console.log("data");
      /*   // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        user.authdata = window.btoa(username + ':' + pwd);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.loggedIn = true; */
        return data;
      }));
    
  }


  logOut() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.loggedIn = false;
  }

  isAdmin():Promise<any> {
    const isUserAdmin = new Promise((resolve, reject) => {
      resolve(this.loggedIn);
    });

    return isUserAdmin;
    }
}
