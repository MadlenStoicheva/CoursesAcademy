import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { NgForm } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { User } from 'src/app/shared/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  flagche:Boolean;
  usersCollection: AngularFirestoreCollection<User>;
  users:  Observable<User[]>;

  constructor(private service : UserService,
    private firestore:AngularFirestore,
    private toastr: ToastrService,
    public auth : AuthService
    ) { }

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
  
    if(form.value.isBlocked==null || form.value.role==null){
      if(form.value.isBlocked==null){
        form.value.isBlocked=false;
      }else if(form.value.role==null){
        form.value.role=false;
      }
    }
 
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
        this.flagche=false;
      } else {
        this.flagche=true;
      }
    })
    if( this.flagche==true){
      this.toastr.error('Email match found for user', 'Register');
    }

    if(this.flagche==false){
      if(form.value.id==null){
        this.firestore.collection('users').add(data);
        this.auth.signup(data.email, data.password);
        data.email = data.password = '';
      }
    }else if(this.flagche==true && form.value.id!=null) {
        this.firestore.doc('users/'+form.value.id).update(data);
        this.resetForm(form);
        this.toastr.success('Submited Successfully!', 'Add User');
        }
    }
  }
