import { AfterViewInit, Component, EventEmitter, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { faEdit, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-confirm-order-details',
  templateUrl: './confirm-order-details.component.html',
  styleUrls: ['./confirm-order-details.component.scss']
})
export class ConfirmOrderDetailsComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  @Input() product;
  @Input() productList?;
  productImages: any;
  faEdit = faEdit;
  faCheckSquare = faCheckSquare;
  editedProduct: any;
  productImagesToBeEdited: any;
  editMode = false;
  currentCurrency: any;
  constructor(
    public modalRef: BsModalRef,
    private commonService: CommonService
    ) {
  }

  ngOnInit(): void {
    this.setCurrentCurrency();
    this.setUserDetailsForMultipleItems();
  }

  setCurrentCurrency() {
    this.currentCurrency = this.commonService.currentCurrency;
  }

  setUserDetailsForMultipleItems() {
    if(!this.product) {
        this.product = {
          userName: this.productList.userName,
          userAddress: this.productList.userAddress,
          userPhoneNumber: this.productList.userPhoneNumber,
          price: this.productList.price,
          deliveryCharges: this.productList.deliveryCharges
        }
   }
  }

  setEditMode(value) {
    this.editMode = value;
    if(value) {
      this.setDetailsToBeEdited();
    }
    else {
      this.saveEditedDetails();
    }
  }

  setDetailsToBeEdited() {
    this.editedProduct ={
      userAddress: this.product.userAddress,
      userPhoneNumber: this.product.userPhoneNumber
    }
  }
  saveEditedDetails() {
    this.product.userAddress = this.editedProduct.userAddress;
    this.product.userPhoneNumber = this.editedProduct.userPhoneNumber;
  }

  save() {
    this.modalRef.hide();
    this.event.emit(this.product);
  }
}
