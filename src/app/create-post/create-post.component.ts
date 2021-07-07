import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
 
    private mode='create';
    ispostedstr!: string;

    constructor(public postsService: PostsService) {
     }

    ngOnInit(): void {
    }
    onSavePost(form: NgForm) {
      if(form.invalid) {
        console.log('form invalid');
        this.ispostedstr='Please fill the form correctly!';
        return;
      }
      if(this.mode === 'create') {
        this.postsService.addPost(form.value.name, form.value.desc,form.value.imageUrl);
      }
      this.ispostedstr='Posted successfully!';
      form.resetForm();
    }
}
