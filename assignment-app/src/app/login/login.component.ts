import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AssignmentsComponent } from '../assignments/assignments.component';
import { AssignmentsService } from '../shared/assignments.service';
import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() connectedEvent: EventEmitter<any> = new EventEmitter();
  @Input() autoDisconnect: boolean;

  username: string;
  pwd: string;
  err: string;
  model: any = {};
  loading: boolean;
  showPwd: boolean = true;

  revealPwd: boolean = false;

  constructor(private _authService:AuthService, private _assignmentsService:AssignmentsService, private route: ActivatedRoute, private _router: Router) { }

  ngOnInit() : void {
    this.model.username = "";
    this.model.pwd = "";
  }

  connect() {
    this.err = "";
    this.loading = true;
    console.log("username" + this.model.username )
    console.log("pwd" + this.model.pwd )

    this._authService.logIn(this.model.username,this.model.pwd).subscribe(
      (user) => {
        console.log('user' + user)
        this.connectedEvent.emit(true);
        localStorage.setItem('username', user.username);
        localStorage.setItem('pwd', user.pwd);
        this.loading = false;
        this._router.navigate(["/home"])
      },
      (err) => {
        console.log(err)
        this.loading = false;
      }
    );
  }

}
