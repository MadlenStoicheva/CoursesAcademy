import { Injectable } from '@angular/core';
import { Course } from './course.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  formData :Course;

  constructor(private firestore :AngularFirestore) { }

  getCourses(){
   return this.firestore.collection('courses').snapshotChanges();
  }
}
