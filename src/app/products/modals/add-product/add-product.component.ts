import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/services/common-service/common.service';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { ProductService } from 'src/app/services/product-service/product.service';
import {SafeResourceUrlPipe} from 'src/app/pipes/safe-resource-url.pipe';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  providers:[SafeResourceUrlPipe]
})
export class AddProductComponent implements OnInit {
  @Input() editMode; 
  @ViewChild('addProductTemplate') templateRef: TemplateRef<any>;
  modalRef?: BsModalRef;
  productForm: FormGroup;
  productImages=[];
  categories: any;
  className = 'add-product-modalcontainer'
  isAdmin = false;
  files: any;
  currentlyUploadedImageSrc=[];
  productImagesToBeEdited=[]

  constructor(
    private productService: ProductService,
    private commonService: CommonService,
    private modalService: BsModalService,
    private loaderService: LoaderService,
    private safeResourceUrl: SafeResourceUrlPipe
    ) { }

  ngOnInit(): void {
    this.resetCurrentlySelectedImages();
    this.setPrivileges();
    this.createForm();
  }

  resetCurrentlySelectedImages() {
    this.currentlyUploadedImageSrc=[]
  }

  setPrivileges() {
    this.isAdmin = this.commonService.userDetails.isAdmin;
  }

  createForm(): void{
    this.productForm = new FormGroup({
      _id: new FormControl('') , 
      categoryId: new FormControl('', Validators.required) , 
      productName: new FormControl('', Validators.required) ,      
      description: new FormControl(''),
      shlok: new FormControl(''),
      references: new FormControl(''),
      dosage: new FormControl(''),
      indications: new FormControl(''),
      contraIndications: new FormControl(''),
      sanskritName: new FormControl(''),
      botanicalName: new FormControl(''),
      drugQuantity: new FormControl(''),
      stock: new FormControl(0),
      price: new FormControl(0),
      productImage: new FormControl(''),
    })
  }

  ngOnChanges() {
    if(this.editMode && this.editMode.status) {
      this.openAddProductModal(this.templateRef);
      this.setValuesToBeEdited(this.editMode.editedItem);
    }
  }

  setValuesToBeEdited(editedItem) {
    this.productForm.patchValue(editedItem);
    this.setImagesToBeEdited(editedItem);
  }

  getProductImageToBeShown() {
    this.currentlyUploadedImageSrc=[];
    this.productImagesToBeEdited= this.productService.getAllProductImagesToBeShown(this.productImages);
  }

  setImagesToBeEdited(editedItem) {
    this.productImages = editedItem.productImages;
    this.getProductImageToBeShown();
  }

  openAddProductModal(templateRef:TemplateRef<any>, editMode?): void{
    this.setEditModeForAdd(editMode)
    this.productForm.reset();
    this.getCategories();
    const config= this.commonService.getModalConfig(this.className);
    this.modalRef = this.modalService.show(templateRef, config);
  }

  setEditModeForAdd(editMode) {
    if(editMode==false) {
      this.editMode.status=editMode;
      this.resetProductImagesToBeEdited();
    }
  }

  resetProductImagesToBeEdited() {
    this.productImagesToBeEdited=[];
  }
    
  getFiles(event) {
    this.productImages=[];
    this.currentlyUploadedImageSrc=[];
    for (var i = 0; i < event.target.files.length; i++) {
      this.productImages.push(event.target.files[i]);
      this.setCurrentlyUploadedImgArr(event.target.files[i])
    }
  }

  setCurrentlyUploadedImgArr(file) {
    let imgSrc=URL.createObjectURL(file)
    this.currentlyUploadedImageSrc.push(imgSrc);
  }

  submit(formVal): void{
    console.log('formVal',formVal);
    if(this.editMode && this.editMode.status) {
      this.update(formVal);
    }
    else {
      this.save(formVal);
    }
  }

  setAllFilesInFormData(formData) {
    if(Array.isArray(this.productImages)) {
      for(let i=0;i<this.productImages.length;i++) {
        formData.append('files',this.productImages[i]); 
      }
    }
    else {
      formData.append('productImages', this.productImages);
    }
  } 

  setFormDetailsInFormData(formData, data) {
    for (const property in data) {
      console.log(`${property}: ${data[property]}`);
      formData.append(property, data[property]);
    }
  }

  save(data) {
    let formData = new FormData();
    this.setFilesAndFormDetails(formData, data);
    this.loaderService.display(true);
    this.productService.addProduct(formData).subscribe(response=>{
      this.loaderService.display(false);
      this.handleProductChangeEvent(data);
    })
  }

  setFilesAndFormDetails(formData, data) {
    this.setAllFilesInFormData(formData);
    this.setFormDetailsInFormData(formData, data);
  }

  update(data) {
    let formData = new FormData();
    this.setFilesAndFormDetails(formData, data);
    this.loaderService.display(true);
    this.productService.updateProduct(formData, data).subscribe(response=>{
      this.loaderService.display(false);
      this.handleProductChangeEvent(this.editMode.editedItem);
    })
  }

  handleProductChangeEvent(data) {
    this.hideModalAndClearForm();
    if(data.categoryId) {
      this.commonService.refreshProductEvent(data);
    }
  }

  hideModalAndClearForm() {
    this.modalRef?.hide();
    this.productForm.reset();
    this.productImages = [];
  }

  getCategories() {
    this.categories = this.commonService.getCategories();
  }
}
