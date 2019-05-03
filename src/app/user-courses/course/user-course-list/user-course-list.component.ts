import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { userCourses } from 'src/app/shared/userCourses.model';
import { UserCoursesService } from 'src/app/shared/userCourses.service';


@Component({
  selector: 'app-user-course-list',
  templateUrl: './user-course-list.component.html',
  styleUrls: ['./user-course-list.component.css']
})
export class UserCourseListComponent implements OnInit {
  
  allList: userCourses[];
  constructor(private service:UserCoursesService,
    public afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.service.getUserCourses().subscribe(actionArray =>{
      this.allList = actionArray.map(item=>{
        return {
        //  id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as userCourses;
      });
    });
  }

}