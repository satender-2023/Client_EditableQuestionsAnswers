import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/services/common-service/common.service';
import { ProductService } from 'src/app/services/product-service/product.service';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { CartService } from 'src/app/services/cart-service/cart.service';
import { ConfirmOrderDetailsComponent } from '../confirm-order-details/confirm-order-details.component';
import { OrderService } from 'src/app/services/order-service/order.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { showIndicators: true } }
  ]
})
export class ProductDescriptionComponent implements OnInit {
  @Input() product; 
  modalRefProductDescription?: BsModalRef;
  modalRefOrderConfirmation?: BsModalRef;
  productImages: any;
  productImagesToBeEdited: any;
  className = 'product-description-modalcontainer'
  currentCurrency: string;
  orderConfirmationClass: string;
  outOfStockText: string;
  sellerStocksEmptyText: string;

  constructor(
    private modalService: BsModalService,
    private productService: ProductService,
    private commonService: CommonService,
    private loaderService: LoaderService,
    private cartService: CartService,
    private orderService: OrderService,
    private notifierService: NotifierService
    ) { 
      this.outOfStockText = this.commonService.outOfStockText;
      this.sellerStocksEmptyText = this.commonService.sellerStocksEmptyText;
      this.orderConfirmationClass = this.commonService.orderConfirmationClass;
    }

  ngOnInit(): void {
    this.setCurrentCurrency();
    this.setProductQuantityIfNull();
  }

  openProductDescriptionModal(templateRef:TemplateRef<any>): void{
    const config= this.commonService.getModalConfig(this.className);
    this.modalRefProductDescription = this.modalService.show(templateRef, config);
    this.getProductImageToBeShown();
  }
  
  setCurrentCurrency() {
    this.currentCurrency = this.commonService.currentCurrency;
  }

  getProductImageToBeShown() {
    this.productImages= this.productService.getAllProductImagesToBeShown(this.product.productImages);
  }

  addToCart(product) {
    if(this.commonService.checkIfVisitorAndNavigate()) {
      this.modalRefProductDescription.hide();
      this.commonService.navigateToLoginPage();
   }
   else {
      let data = product;
      this.commonService.addUserDetails(data);
      this.loaderService.display(true);
      this.cartService.addToCartList(data).subscribe(response=>{
        this.loaderService.display(false);
        console.log('product added to cart successfully');
        this.cartService.cartItemChange.next();
      })
    }
  }

  changeQty(product) {
    console.log('qty', product.quantity)
  }
 
  setProductQuantityIfNull() {
    if(!this.product.quantity) {
      this.product.quantity = 1;
    }
  }

  decrementQuantity(product) {
    if(product.quantity >0) {
       product.quantity -= 1;
    }
  }

  incrementQuantity(product) {
    product.quantity += 1;
  }

  openOrderConfirmationModal(product): void{
    if(this.commonService.checkIfVisitorAndNavigate()) {
      this.modalRefProductDescription.hide();
      this.commonService.navigateToLoginPage();
   }
   else {
      this.modalRefProductDescription.hide();
      this.commonService.addUserDetails(product);
      const initialState: any = {
        initialState: {
          product
        },
        class: this.orderConfirmationClass
      };
      const config= this.commonService.getModalConfig(this.orderConfirmationClass);
      this.modalRefOrderConfirmation = this.modalService.show(ConfirmOrderDetailsComponent, initialState);
      this.modalRefOrderConfirmation.content.event.subscribe(data=>{
        this.placeOrder(data);
      });
    }
  }

  placeOrder(cartItem) {
    this.loaderService.display(true);
    this.orderService.addToOrderList(cartItem).subscribe(response=>{
      this.loaderService.display(false);
      this.notifierService.notify('success', 'Order placed successfully!');
      this.modalRefProductDescription.hide();
    })
  }

}
