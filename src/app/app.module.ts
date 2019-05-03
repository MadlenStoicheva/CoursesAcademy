import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserService } from './shared/user.service';
import { LoginComponent } from './login/login.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseComponent } from './courses/course/course.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseService } from './shared/course.service';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AuthService } from './shared/auth.service';
import { RegisterComponent } from './register/register.component';
import { UserCourseListComponent } from './user-courses/course/user-course-list/user-course-list.component';
import { UserCoursesComponent } from './user-courses/user-courses.component';
import { RatingComponent } from './user-courses/course/rating/rating.component';
import { IsUserBlockedComponent } from './users/is-user-blocked/is-user-blocked.component';
import { MyCourcesListComponent } from './user-courses/course/my-cources-list/my-cources-list.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserComponent,
    UserListComponent,
    LoginComponent,
    CoursesComponent,
    CourseComponent,
    CourseListComponent,
    RegisterComponent,
    UserCourseListComponent,
    UserCoursesComponent,
    RatingComponent,
    IsUserBlockedComponent,
    MyCourcesListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    /**/
    AngularFireAuthModule
  ],
  providers: [UserService, CourseService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
