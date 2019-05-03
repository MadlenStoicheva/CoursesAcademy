import { Injectable  } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:Observable<firebase.User>;
  public loggedIn = false;
  email: string;
  usersCollection: AngularFirestoreCollection<User>;
  loggedUser: User;
  users:  Observable<User[]>;
  isLoggedUserAdmin : Boolean = false;
  public flag = false;
  
  blockedUsersCollection: AngularFirestoreCollection<User>;
  blockedUsers:  Observable<User[]>;
  isBlocked:Boolean = false;
  blockedUsersList:User[];

  constructor(
    private toastr: ToastrService,
    private firestore:AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router
  ) {
  }
  
  blockedUser :Boolean; 
  login(email:string, password:string){

   this.blockedUsersCollection = this.firestore.collection('users', ref => ref.where('email', '==', email).where('isBlocked', '==', true))
   this.blockedUsers = this.blockedUsersCollection.snapshotChanges().map(actions => {
    return actions.map(action => {
      const dataB = action.payload.doc.data() as User;
      this.loggedUser=dataB;
      this.blockedUser=dataB.isBlocked;

      return { 
        id: action.payload.doc.id,
        email: dataB.email,
        name: dataB.name,
        password:dataB.password,
        isBlocked:dataB.isBlocked,
        role:dataB.role
      }

    });
  });

  this.blockedUsers.subscribe(snapshot => {
    if(snapshot.length != 0) {  
      this.toastr.warning('You are blocked!');
      this.blockedUser = true;
      console.log(this.blockedUser);
      window.location.reload();
      }
      else{
        this.blockedUser =false;
      }
  })

    if(this.blockedUser==false)
    {
    this.usersCollection = this.firestore.collection('users', ref => ref.where('email', '==', email).where('role', '==', true))
    this.users = this.usersCollection.snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as User;
        this.loggedUser=data;
        
        return { 
          id: action.payload.doc.id,
          email: data.email,
          name: data.name,
          password:data.password,
          isBlocked:data.isBlocked,
          role:data.role
        }
      });
    });
    
    this.users.subscribe(snapshot => {
      if(snapshot.length != 0) {  
        this.toastr.warning('Hi Admin');
        this.flag=true;
      }
    })
    
    this.afAuth.auth.signInWithEmailAndPassword(email,password).then(
      value=>{
        console.log('You are logged in!');
      
        this.email=email;
        sessionStorage.setItem('user', email);
        let user = this.afAuth.auth.currentUser;
        if(user.email == email){

          this.toastr.success(user.email, 'Login');
          this.setCurrentUser(user.uid);
        }else{
          this.toastr.warning('Email do not match!', 'Login');
        }

        this.router.navigate(['courses']);
        this.loggedIn = true;
      }
    ).catch(err =>{
        console.log('Error!' , err.message);
      } )
  }
}
  isUserAdmin(){
    return this.flag;
  }
  
  signup(email:string, password:string){
    this.afAuth.auth.createUserWithEmailAndPassword(email,password).then(
      value=>{
        this.toastr.success('Register Successfully!', 'Register');
        this.router.navigate(['login']);
      }
    ).catch(err =>{
        console.log('Error!' , err.message);
      })
  }

  // Set current user in your session after a successful login
  setCurrentUser(id: string): void {
    sessionStorage.setItem('user', id);
    this.loggedIn = true;
  }

  // Get currently logged in user from session
  getCurrentUser(): string | any {
    return sessionStorage.getItem('user') || undefined;
  }

  // Clear the session for current user & log the user out
  logout() {
    this.afAuth.auth.signOut();
    sessionStorage.removeItem('user');
    this.loggedIn = false;
    console.log('Logged out!');

  }

  isLoggedIn() {
    return this.loggedIn;
  }
}