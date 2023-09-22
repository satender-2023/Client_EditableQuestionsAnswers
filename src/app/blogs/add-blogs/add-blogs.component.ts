import { HttpClient } from '@angular/common/http';
import { Component,SimpleChange,TemplateRef,  OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BlogService } from 'src/app/services/blog/blog.service';
import { CommonService } from 'src/app/services/common-service/common.service';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { ProductService } from 'src/app/services/product-service/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-blogs',
  templateUrl: './add-blogs.component.html',
  styleUrls: ['./add-blogs.component.scss']
})

export class AddBlogsComponent implements OnInit {
  @Input() editMode: any;
  @Output() editingComplete = new EventEmitter<void>();
  @ViewChild('addBlogTemplate') templateRef: TemplateRef<any>;
  categoryForm: FormGroup;
  categorySelectedObj = {

    isAllCategorySelected: true
  }; 
  blog: any = {
    blogName: '',
    blogDesc: ''
  }
  constructor(public modalRef: BsModalRef, 
    private http: HttpClient, 
    private productService: ProductService,
    private loaderService: LoaderService,
    private notifierService: NotifierService,
    private commonService: CommonService,
    private blogService: BlogService,
    private modalService: BsModalService,
  ) { }

  urls = [];
  ngOnInit(): void {
   

    if (this.editMode && this.editMode.status) {
      this.setValuesToBeEdited(this.editMode.editedItem);
    }
  }
  
  ngOnChanges(changes: SimpleChange) {
    if(this.editMode && this.editMode.status && this.modalService['modalsCount'] == 0) {
      this.openCategoryModal(this.templateRef);
      this.setValuesToBeEdited(this.editMode.editedItem);
    }
  }
  setValuesToBeEdited(editedItem) {
    this.blog._id = editedItem._id; // Set the _id property
    this.blog.blogName = editedItem.blogName;
    this.blog.blogDesc = editedItem.blogDesc;
  
  }

  openCategoryModal(templateRef:TemplateRef<any>): void{

    const config= this.commonService.getModalConfig();
    this.modalRef = this.modalService.show(templateRef, config);
  }

  hideCategoryModal() {
    this.modalRef.hide();
  }

  onselectFile(e: any) {
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.onload = (events: any) => {
          this.urls.push(events.target.result);
        }
      }
    }
  }

  save(formVal): void {
    if (this.editMode && this.editMode.status) {
      this.update(formVal);
    } else {
      this.add(formVal);
    }
  }

  submit(): void {

  
    if (this.editMode && this.editMode.status) {
      this.update(this.blog); // Update existing blog
    } else {
      this.add(this.blog); // Add new blog
    }
  }
  
  update(data): void {
    this.loaderService.display(true);
    this.blogService.updateBlogs(data).subscribe(data => {
      this.loaderService.display(false);
      this.notifierService.notify('success', 'Blog updated successfully!');
      this.handleCategoryChangeEvent(data);
    });
  }
  add(data): void {
    this.loaderService.display(true);
    this.blogService.addBlogs(data).subscribe(data => {
      this.loaderService.display(false);
      this.notifierService.notify('success', 'Blog added successfully!');
      this.handleCategoryChangeEvent(data);

    });
  }
  
  
  handleCategoryChangeEvent(data) {
    this.modalRef?.hide();
    this.commonService.refreshBlogsEvent(data);
    console.log(data)
  }
  
}
