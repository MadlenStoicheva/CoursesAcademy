import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CoursesComponent } from './courses/courses.component';
import { UsersComponent } from './users/users.component';
import { RegisterComponent } from './register/register.component';
import { UserCoursesComponent } from './user-courses/user-courses.component';
import { MyCourcesListComponent } from './user-courses/course/my-cources-list/my-cources-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'users', component: UsersComponent },
  { path: 'user-courses', component: UserCoursesComponent },
  { path: 'my-cources-list', component: MyCourcesListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
