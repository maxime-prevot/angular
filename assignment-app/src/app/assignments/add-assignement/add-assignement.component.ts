import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import {Assignment} from '../assignment.model';

@Component({
  selector: 'app-add-assignement',
  templateUrl: './add-assignement.component.html',
  styleUrls: ['./add-assignement.component.css']
})
export class AddAssignementComponent implements OnInit {
  // form
  nomDevoir:string;
  dateDeRendu:Date;

  matieres = ["Techno Web","Base de données","IA"]
  nomFormGroup: FormGroup;
  dateFormGroup: FormGroup;
  auteurFormGroup: FormGroup;
  matiereFormGroup: FormGroup;
  /* renduFormGroup: FormGroup; */
  constructor(private assignmentsService:AssignmentsService,
              private router:Router, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.resetForm();
  }

  resetForm() {
    this.nomFormGroup = this._formBuilder.group({
      nomControl: ['', Validators.required]
    });
    this.dateFormGroup = this._formBuilder.group({
      dateControl: [new Date(), Validators.required]
    });
    this.auteurFormGroup = this._formBuilder.group({
      auteurControl: ['', Validators.required]
    });
    this.matiereFormGroup = this._formBuilder.group({
      matiereControl: ['', Validators.required]
    });
   /*  this.renduFormGroup = this._formBuilder.group({
      renduControl: [new Boolean(), Validators.required]
    }); */
  }
  onSubmit(event) {
    event.preventDefault();
    console.log("onSubmit")
    const newAssignment = new Assignment();

    newAssignment.nom = this.nomFormGroup.get("nomControl").value;
    newAssignment.dateDeRendu = this.dateFormGroup.get("dateControl").value;
    /* newAssignment.rendu = this.renduFormGroup.get("renduControl").value; */
    newAssignment.auteur = this.auteurFormGroup.get("auteurControl").value;
    newAssignment.matiere = this.matiereFormGroup.get("matiereControl").value;
    newAssignment.id = Math.ceil(Math.random()*100000);


    //this.nouvelAssignment.emit(newAssignment);
    //this.assignments.push(newAssignment);
    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(message => {
      console.log(message);
      //on veut re-afficher la page d'accueil avec la liste
      this.router.navigate(["/home"]);
    })
  }

}
