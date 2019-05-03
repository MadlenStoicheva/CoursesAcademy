import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from 'src/app/shared/course.service';
import { Course } from 'src/app/shared/course.model';
import { CoursesComponent } from '../courses.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { userCourses } from 'src/app/shared/userCourses.model';
import { UserCoursesService } from 'src/app/shared/userCourses.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  list: Course[];
  constructor(private service:CourseService,
    private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,
    private toastr:ToastrService,
    private userCService:UserCoursesService,
    public auth : AuthService
  ) { }

  ngOnInit() {
    this.service.getCourses().subscribe(actionArray =>{
      this.list = actionArray.map(item=>{
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Course;
      });
    });
  }

  onEdit(course:Course){
    this.service.formData = Object.assign({}, course);
  }
  /*
  getUser(id:string){
  return this.db.object('users' + this.afAuth.auth.currentUser.uid)
  }
  */
  getCourse(course:Course){
    
    //взимам id-то на логнатия юзър
    this.afAuth.auth.currentUser;

    //сетвам стойностите към модела userService
    this.userCService.allData = {
      /* id:'',*/
      course:course,
      userEmail:this.afAuth.auth.currentUser.email,
      userId:this.afAuth.auth.currentUser.uid,
      /*userId:user,
       courseId:course.id,
       courseTitle:course.title,
       courseDescription:course.description*/

    }
    let data = Object.assign({},this.userCService.allData);
    this.firestore.collection('userCourses').add(data);
    this.toastr.success('Title: ' +  data.course.title  + " ,  Desc: " + data.course.description , 'Successfully added!');

  }

  onDelete(id:string){
    if(confirm('Are you sure to delete this record?')){
      this.firestore.doc('courses/' + id).delete();
      this.toastr.warning('Deleted successfully!', 'Courses');
    }
  }

}
