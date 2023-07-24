import { Component, Input, OnInit, SimpleChange, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/services/common-service/common.service';
import { ProductService } from 'src/app/services/product-service/product.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
 
  @Input() editMode; 
  faPlus = faPlus;
  modalRef?: BsModalRef;
  categoryForm: FormGroup;
  @ViewChild('addCategoryTemplate') templateRef: TemplateRef<any>;
  isAdmin = false;

  constructor(
    private productService: ProductService,
    private commonService: CommonService,
    private modalService: BsModalService,
    private loaderService: LoaderService,
    private notifierService: NotifierService
    ) { }

  ngOnInit(): void {
    this.handleUserLoggedInSubscriptions();
    this.setPrivileges();
    this.createForm()
  }

  handleUserLoggedInSubscriptions() {
    this.commonService.userLoggedIn.subscribe(data => {
      this.setPrivileges();
    })
  }

  setPrivileges() {
    this.isAdmin = this.commonService.userDetails.isAdmin;
  }
  
  ngOnChanges(changes: SimpleChange) {
    if(this.editMode && this.editMode.status && this.modalService['modalsCount'] == 0) {
      this.openCategoryModal(this.templateRef);
      this.setValuesToBeEdited(this.editMode.editedItem);
    }
  }

  setValuesToBeEdited(editedItem) {
    this.categoryForm.setValue({
      categoryName: editedItem.categoryName,
      _id: editedItem._id
    })
  }

  createForm(): void{
    this.categoryForm = new FormGroup({
      _id: new FormControl('', Validators.required) , 
      categoryName: new FormControl('', Validators.required) ,      
    })
  }

  openCategoryModal(templateRef:TemplateRef<any>): void{
    this.categoryForm.reset();
    const config= this.commonService.getModalConfig();
    this.modalRef = this.modalService.show(templateRef, config);
  }

  hideCategoryModal() {
    this.modalRef.hide();
  }

  submit(formVal): void{
    if(this.editMode && this.editMode.status) {
      this.update(formVal);
    }
    else {
      this.save(formVal);
    }
  }

  save(data) {
    this.loaderService.display(true);
    this.productService.addCategory(data).subscribe(data=>{
      this.loaderService.display(false);
      this.notifierService.notify('success', 'Category added successfully!');
      this.handleCategoryChangeEvent(data);
    })
  }

  update(data) {
    this.loaderService.display(true);
    this.productService.updateCategory(data).subscribe(data=>{
      this.loaderService.display(false);
      this.handleCategoryChangeEvent(data);
    })
  }

  handleCategoryChangeEvent(data) {
    this.modalRef?.hide();
    this.commonService.refreshCategoryEvent(data);
  }
}
