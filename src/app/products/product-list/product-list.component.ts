import { Component, OnInit } from '@angular/core';
import { CategoryMenuComponent } from 'src/app/partial_views/category-menu/category-menu.component';
import { CommonService } from 'src/app/services/common-service/common.service';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { ProductService } from 'src/app/services/product-service/product.service';
import { faTrash,faEdit } from '@fortawesome/free-solid-svg-icons';
import { CartService } from 'src/app/services/cart-service/cart.service';
import { OrderService } from 'src/app/services/order-service/order.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmOrderDetailsComponent } from '../modals/confirm-order-details/confirm-order-details.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  orderConfirmationClass: string;
  outOfStockText: string;
  products: any;
  categoryId;
  faTrash=faTrash;
  faEdit=faEdit;
  isAllCategorySelected = true;
  editMode = { 
    status: false, 
    editedItem: {} 
  };
  isAdmin = false;
  unfilteredProducts: any;
  currentCurrency: string;
  modalRef: BsModalRef;
  sellerStocksEmptyText: string;
  isFireCrackerShown = false;
  
  constructor(
    private loaderService: LoaderService,
    private productService: ProductService,
    private commonService: CommonService,
    private cartService: CartService,
    private orderService: OrderService,
    private modalService: BsModalService,
    private notifierService: NotifierService
    ) { 
      this.outOfStockText = this.commonService.outOfStockText;
      this.sellerStocksEmptyText = this.commonService.sellerStocksEmptyText;
      this.orderConfirmationClass = this.commonService.orderConfirmationClass;
    }

  ngOnInit(): void {
    this.setPrivileges();
    this.handleSubscriptions();
    this.handleProductSearchSubsriptions();
    this.setCurrentCurrency();
  }

  setPrivileges() {
    this.isAdmin = this.commonService.userDetails.isAdmin;
  }

  setCurrentCurrency() {
    this.currentCurrency = this.commonService.currentCurrency;
  }

  handleSubscriptions() {
    this.commonService.refreshProduct.subscribe(data=>{
      if(data && data['isAllCategorySelected']) {
         this.isAllCategorySelected = true;
         this.getAllProducts();
      }
      else {
        this.isAllCategorySelected = false;
        this.setCategoryIdParamIfNotAvailable(data);
        this.getProducts(data['categoryId']);
      }
    })
  
  }

  handleProductSearchSubsriptions() {
    this.productService.productDataSearch.subscribe(data=>{
       this.products = this.commonService.filterDataBySearchString(this.unfilteredProducts,data);
    })
  }

  setCategoryIdParamIfNotAvailable(data) {
     if(!data.categoryId) {
        data.categoryId = data['_id'];
     }
  }

  getProducts(data?) {
    this.loaderService.display(true);
    this.productService.getProductListByCategoryId(data).subscribe(data=>{
       this.products = data;
       this.unfilteredProducts = data;
       this.loaderService.display(false);
    })
  }

  getAllProducts() {
    this.loaderService.display(true);
    this.productService.getAllProductList().subscribe(data=>{
      this.products = data;
      this.unfilteredProducts = data;
      this.loaderService.display(false);
    })
  }

  deleteProduct(data) {
    let result=this.commonService.confirmAction();
    if(result) {
    this.loaderService.display(true);
    this.productService.deleteProduct(data._id).subscribe(response=>{
      this.checkAndLoadProductsByCategory(data);
      this.loaderService.display(false);
    })
   }
  }

  checkAndLoadProductsByCategory(data) {
    if(this.isAllCategorySelected) {
      this.getAllProducts();
    }
    else {
      this.getProducts(data['categoryId']);
    }
  }

  editProduct(item){
    let editedItem=JSON.parse(JSON.stringify(item));
    this.editMode={ 
      status: true,
      editedItem: editedItem
    };
  }

  getProductImageToBeShown(productImage) {
    return this.productService.getProductImageToBeShown(productImage);
  }

  addToCart(product) {
    if(this.commonService.checkIfVisitorAndNavigate()) {
       this.commonService.navigateToLoginPage();
    }
    else {
      this.setProductId(product);
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

  setProductId(product) {
    product.productId = product._id;
  }

  changeQty(product) {
    console.log('qty', product.quantity)
  }

  receiveProductAddEvent(data) {

  }

  receiveCategoryAddEvent() {
    
  }

  openOrderConfirmationModal(product): void{
    if(this.commonService.checkIfVisitorAndNavigate()) {
      this.commonService.navigateToLoginPage();
   }
   else {
      this.commonService.addUserDetails(product);
      const initialState: any = {
        initialState: {
          product
        },
        class: this.orderConfirmationClass
      };
      const config= this.commonService.getModalConfig(this.orderConfirmationClass);
      this.modalRef = this.modalService.show(ConfirmOrderDetailsComponent, initialState);
      this.modalRef.content.event.subscribe(data=>{
        this.placeOrder(data);
      });
    }
  }

  placeOrder(cartItem) {
    this.loaderService.display(true);
    this.orderService.addToOrderList(cartItem).subscribe(response=>{
      this.loaderService.display(false);
      this.notifierService.notify('success', 'Order placed successfully!');
      this.showFireCrackers();
    })
  }

  decrementQuantity(product) {
    if(product.quantity >0) {
       product.quantity -= 1;
    }
  }

  incrementQuantity(product) {
    product.quantity += 1;
  }

  showFireCrackers() {
    this.isFireCrackerShown= true;
    setTimeout(()=>{
      this.isFireCrackerShown = false;
    },this.commonService.fireCrackersTimeout);
  }
}
