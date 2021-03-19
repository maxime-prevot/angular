import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private _authService:AuthService, private _assignmentsService:AssignmentsService, private route: ActivatedRoute, private _router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit() : void {
    this.model.username = "";
    this.model.pwd = "";
  }

  openSnackBar(message: string){
    this._snackBar.open(message, 'X', {
      duration: 3000,
    });
  }
  connect() {
    this.err = "";
    this.loading = true;
    console.log("username" + this.model.username )
    console.log("pwd" + this.model.pwd )

    this._authService.logIn(this.model.username,this.model.pwd).subscribe(
      (res) => {
        this.openSnackBar("Bienvenue !");
        this._router.navigate(["/home"])
      },
      (err) => {
        this.openSnackBar("Mauvais identifiant et/ou mot de passe !");
        this.loading = false;
      }
    );
  }

}
