import { Component, OnInit } from '@angular/core';

import {AuthService} from '../shared/auth.service'
import { reject } from 'q';
import { UserService } from '../shared/user.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { User } from '../shared/user.model';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email:string;
  password:string;
  name : string;
  role : boolean;
  isBlocked : boolean;

  flagche:Boolean;

  usersCollection: AngularFirestoreCollection<User>;
  users:  Observable<User[]>;

  constructor(private service : UserService,
    private firestore:AngularFirestore,
    private toastr: ToastrService,
    public auth : AuthService) { }

    ngOnInit() {
      this.resetForm();
    }

    resetForm(form? :NgForm){
      if(form!=null)
        form.resetForm();
      this.service.formData={
        id:null,
        name:'',
        email : '',
        password : '',
        role : false,
        isBlocked : false,
      }
    }

    onSubmit(form : NgForm){
      let data = Object.assign({}, form.value);
      //iztrivame id-to
      delete data.id;
      this.usersCollection = this.firestore.collection('users', ref => ref.where('email', '==', form.value.email))
      this.users = this.usersCollection.snapshotChanges().map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as User;
  
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
        if(snapshot.length == 0) {  
          this.flagche=true;
        } else {
          this.toastr.error('Email match found for user', 'Register');
          this.flagche=false;
        }
      })

      if(form.value.id==null && this.flagche==true){
        this.firestore.collection('users').add(data);
        this.auth.signup(data.email, data.password);
        this.toastr.success('Email match NOT found', 'Register');
   
      }

/*
      if(form.value.id==null){
        this.firestore.collection('users').add(data);
        this.auth.signup(data.email, data.password);
        //data.email = data.password = '';
      }
      else
      this.firestore.doc('users/'+form.value.id).update(data);
      this.resetForm(form);
      //  this.toastr.success('Submited Successfully!', 'Register');
      */
    }

    /*
     logUser(forma: NgForm){
      if(forma.value.id==null ){
        this.firestore.collection('users').add(forma.value);
        this.auth.signup(forma.value.email, forma.value.password);
        //data.email = data.password = '';
      }
    }

    */
}
