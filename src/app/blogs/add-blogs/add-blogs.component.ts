import { Component,SimpleChange, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { BlogService } from 'src/app/services/blog/blog.service';
import { CommonService } from 'src/app/services/common-service/common.service';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from './../../../lib/config';
import { AngularEditorComponent } from './../../../lib/angular-editor.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-blogs',
  templateUrl: './add-blogs.component.html',
  styleUrls: ['./add-blogs.component.scss']
})

export class AddBlogsComponent implements OnInit {
  @ViewChild(AngularEditorComponent) editor: AngularEditorComponent; // ViewChild reference to the AngularEditorComponent

  config1: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '15rem',
    maxHeight: 'auto',
    placeholder: 'Enter here...',
    translate: 'no',
    sanitize: false,
    // toolbarPosition: 'top',
    outline: true,
    // defaultFontName: 'Comic Sans MS',
    // defaultFontSize: '5',
    // showToolbar: false,
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'text-center',
        class: 'text-center',
      },
      {
        name: 'text-right',
        class: 'text-right',
      },
      {
        name: 'img-center',
        class: 'img-center',
      },
      {
        name: 'img-right',
        class: 'img-right',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      // ['bold', 'italic'],
      // ['fontSize']
    ],
      editHistoryLimit: 3,
    imageResizeSensitivity: 2,
  };

  blogForm: FormGroup;
  blogId: string;
  editMode: boolean  = false;

  constructor(
    private loaderService: LoaderService,
    private notifierService: NotifierService,
    private commonService: CommonService,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  urls = [];
  ngOnInit(): void {

    this.createForm();

    this.route.paramMap.subscribe((params) => {
      this.blogId = params.get('blogId')!;
      if (this.blogId) {
        this.editMode = true;
        this.getBlogDetail(this.blogId);
      }
    });


  }

  getBlogDetail(blogId: string): void {
    this.blogService.getBlogDetail(blogId).subscribe((blog) => {
      this.setValuesToBeEdited(blog);
    })
  }

  createForm(): void{
    this.blogForm = new FormGroup({
      title: new FormControl('', Validators.required) , 
      content: new FormControl('', Validators.required) ,      
      category: new FormControl('', Validators.required),
      aboutAuthor: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required),
    })
  }

  setValuesToBeEdited(editedItem) {
    this.blogId = editedItem._id;
    this.blogForm.setValue({
      title: editedItem.title,
      content: editedItem.content,
      category: editedItem.category,
      author: editedItem.author,
      aboutAuthor: editedItem.aboutAuthor || '',
    });
  
  }
  
  submit(): void {
    this.loaderService.display(true);
    if (!this.blogForm.valid) {
      return;
    }

    if (this.editMode) {
      this.update(this.blogForm.value); // Update existing blog
    } else {
      this.add(this.blogForm.value); // Add new blog
    }
  }
  
  update(data): void {
    this.loaderService.display(true);
    this.blogService.updateBlogs(this.blogId, data).subscribe(updatedData => {

      this.loaderService.display(false);
      this.notifierService.notify('success', 'Blog updated successfully!');
      this.handleCategoryChangeEvent(updatedData);
    }, (error) => {
      console.log('error', error);
    });
  }
  
  add(data): void {
    this.blogService.addBlogs(data).subscribe(newData => {
      this.loaderService.display(false);
      this.notifierService.notify('success', 'Blog added successfully!');
      this.handleCategoryChangeEvent(newData);
    });
  }
  
  handleCategoryChangeEvent(data) {
    // this.modalRef?.hide();
    this.router.navigate(['/blogs']);
    // this.blogId = '';
    // this.commonService.refreshCategoryEvent(data);
  }
  
  onChange(event) {}
  onBlur(event) {}


}
