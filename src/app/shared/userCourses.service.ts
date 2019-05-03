import { Injectable } from '@angular/core';
import { Course } from './course.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { userCourses } from './userCourses.model';

@Injectable({
  providedIn: 'root'
})
export class UserCoursesService {

  allData :userCourses;

  constructor(private firestore :AngularFirestore) { }

  getUserCourses(){
   return this.firestore.collection('userCourses').snapshotChanges();
  }
}
