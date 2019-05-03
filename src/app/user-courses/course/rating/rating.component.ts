import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CourseService } from 'src/app/shared/course.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {

  constructor(private service : CourseService,
    private firestore:AngularFirestore,
    private toastr: ToastrService) { }
    

  ngOnInit() {
    this.resetForm();
  }

  resetForm(form? :NgForm){
    if(form!=null)
      form.resetForm();
    this.service.formData={
      id:null,
      title: '',
      description: '',
      rating: 0
    }
  }


  onSubmit(form : NgForm){

    form.value.rating++;
    let data = Object.assign({}, form.value);
    
    //iztrivame id-to
    delete data.id;
    if(form.value.id==null)
    this.firestore.collection('courses').add(data);
    else
    this.firestore.doc('courses/'+form.value.id).update(data);
    this.firestore.doc('userCourses/'+form.value.id).update(data);
    this.resetForm(form);
    this.toastr.success('Successfully!', 'Add Course Rating');
  }
}