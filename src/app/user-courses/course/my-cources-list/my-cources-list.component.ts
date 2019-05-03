import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/user.model';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { auth } from 'firebase';
import { userCourses } from 'src/app/shared/userCourses.model';

@Component({
  selector: 'app-my-cources-list',
  templateUrl: './my-cources-list.component.html',
  styleUrls: ['./my-cources-list.component.css']
})
export class MyCourcesListComponent implements OnInit {

  usersCollection: AngularFirestoreCollection<userCourses>;
  users:  Observable<userCourses[]>;
  allList: userCourses[];

  constructor( private toastr: ToastrService,
     private firestore:AngularFirestore,
     public afAuth: AngularFireAuth,
     public auth: AuthService,
     public router: Router) { }

  ngOnInit() {
    this.auth.getCurrentUser();

    this.usersCollection = this.firestore.collection('userCourses', ref => ref.where('userId', '==',  this.auth.getCurrentUser()))
    this.users = this.usersCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as userCourses;
        
        return { 
          id: action.payload.doc.id,
          userId: data.userId,
          userEmail: data.userEmail,
          course: data.course,
          title: data.course.title,
          description : data.course.description,
          rating: data.course.rating
        }
      });
    });

    this.users.subscribe(actionArray =>{
      this.allList = actionArray.map(item=>{
        return {
          userId:item.userId,
          userEmail:item.userEmail,
          course:item.course
        } as userCourses;
      });
    });
  }
}