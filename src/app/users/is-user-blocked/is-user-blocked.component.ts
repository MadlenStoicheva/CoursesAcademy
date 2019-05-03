import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-is-user-blocked',
  templateUrl: './is-user-blocked.component.html',
  styleUrls: ['./is-user-blocked.component.css']
})
export class IsUserBlockedComponent implements OnInit {

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
    if(form.value.id==null){
      this.firestore.collection('users').add(data);
      this.auth.signup(data.email, data.password);
      data.email = data.password = '';
    }
    else
    this.firestore.doc('users/'+form.value.id).update(data);
    this.resetForm(form);
    this.toastr.success('Submited Successfully!', 'Block User');
  }

}
