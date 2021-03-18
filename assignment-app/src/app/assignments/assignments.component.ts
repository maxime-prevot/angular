import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs/operators';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import {MatDialog} from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {

  assignmentsNonRendus: Assignment[];
  assignmentsRendus: Assignment[];
  titre = 'Mon application sur les Assignments 2 !';
  formVisible = false;
  assignments: Assignment[] = [];
  assignmentSelectionne: Assignment;
  dataSource: MatTableDataSource<Assignment>;
  matiereSelected = "";
  matieres = ["Bases de données", "Techno Web", "IA"];
  displayedColumns = ["nom","dateDeRendu","auteur","matiere", "remarques", "note", "rendu","id"]
  
  page: Number;
  nextPage: Number = 1;
  limit: Number = 10;
  countAssignments: Number;

  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;

  constructor(
    private assignmentsService: AssignmentsService,
    private ngZone: NgZone, private _router: Router
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.assignmentsService.getAssignments()
    .subscribe((data) => {
      var assignments = data["docs"];
      // appelé que quand les données sont prêtes
      this.assignmentsNonRendus = assignments.filter((assignment) => {
        return !assignment.rendu;
      });
      console.log(this.assignmentsNonRendus);
      this.assignmentsRendus = assignments.filter((assignment) => {
        return assignment.rendu;
      });
    });
    this.getAssignments(); 
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); 
    filterValue = filterValue.toLowerCase(); 
    this.dataSource.filter = filterValue;
  }

  // avec pagination...
  getAssignments() {
    if (!this.nextPage) return;
    this.assignmentsService
      .getAssignmentsPagine(this.nextPage, this.limit)
      .subscribe((data) => {
        console.log("DATA "+ data)
        this.page = data['page'];
        this.nextPage = data['nextPage'];
        this.countAssignments = data['totalDocs'];
        this.assignments = this.assignments.concat(data['docs']);
      });
  }

  ngAfterViewInit() {
    console.log('After view init');
    this.scroller
      .elementScrolled()
      .pipe(
        // on transforme les evenements en distances par rapport au bas du scroll
        map((e) => {
          return this.scroller.measureScrollOffset('bottom');
        }),
        tap((val) => {
          console.log(val);
        }),
        pairwise(),
        filter(([y1, y2]) => {
          return y2 < y1 && y2 < 140;
        }),
        throttleTime(200) // on n'enverra un subscribe que toutes les 200ms (on ignorera les evenements entre...)
      )
      .subscribe((_) => {
        console.log(
          "...Dans subscribe du scroller, je charge plus d'assignments"
        );
        this.ngZone.run(() => {
          //this.addMoreAssignments();
          this.getAssignments(); // déjà prêt car nextPage re-initialisé à chaque requête
        });
      });
  }

  assignmentClique(assignment) {
    this.assignmentSelectionne = assignment;
  }
  /*
  onNouvelAssignment(event:Assignment) {
    //this.assignments.push(event);
    this.assignmentsService.addAssignment(event)
    .subscribe(message => {
      console.log("message");
      this.formVisible = false; // on veut voir la liste avec le nouvel assignment
    })
  }
  */

  async peuplerBD()  {
   await  this.assignmentsService.peuplerBDJoin().subscribe((message) => {
      
    });
    
  }

  addMoreAssignments() {
    this.assignmentsService
      .getMoreAssignments(1, 20)
      .subscribe((newAssignments) => {
        console.log('20 nouveaux assignments ajoutés...');
        this.assignments = [...this.assignments, ...newAssignments];
      });
  }
}
