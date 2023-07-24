import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmOrderDetailsComponent } from '../products/modals/confirm-order-details/confirm-order-details.component';
import { CartService } from '../services/cart-service/cart.service';
import { CommonService } from '../services/common-service/common.service';
import { OrderService } from '../services/order-service/order.service';
import { ProductService } from '../services/product-service/product.service';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { LoaderService } from '../services/loader-service/loader.service';
import { NotifierService } from 'angular-notifier';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { showIndicators: false } }
  ]
})
export class CartComponent implements OnInit {

  orderConfirmationClass: string;
  cartItem: Record<string,unknown>;
  cartList: any;
  productImages: any[];
  userDetails: any;
  modalRef: BsModalRef;
  unfilteredCartItems: any;
  currentCurrency: string;
  faTrash= faTrash;
  showMultiSelectedActionbtns = false;
  selectText = 'select';
  deselectText = 'deselect';
  currentSelectionText = this.selectText;
  selectAllActive = false;
  selectedProducts= {
    selectedItems: [],
    userName: '',
    userAddress : '',
    userPhoneNumber: '',
    price: 0,
    deliveryCharges: 0
  };
  sellerStocksEmptyText: string;
  isFireCrackerShown = false;
  constructor(
    private modalService: BsModalService,
    private commonService: CommonService,
    private orderService: OrderService,
    private productService: ProductService,
    private cartService: CartService,
    private loaderService: LoaderService,
    private notifierService: NotifierService
    ) { 
      this.userDetails = this.commonService.userDetails;
      this.sellerStocksEmptyText = this.commonService.sellerStocksEmptyText;
      this.orderConfirmationClass = this.commonService.orderConfirmationClass;
    }

  ngOnInit(): void {
    this.setCurrentCurrency();
    this.getCartItemsByPrivileges();
    this.handleCartSearchSubscriptions();
  }

  setCurrentCurrency() {
    this.currentCurrency = this.commonService.currentCurrency;
  }

  handleCartSearchSubscriptions() {
    this.cartService.cartDataSearch.subscribe(data=>{
       this.cartList = this.commonService.filterDataBySearchString(this.unfilteredCartItems,data);
    })
  }

  getCartItemsByPrivileges() {
    if(this.userDetails.isAdmin) {
      this.getCartItemsAll();
    }
    else {
      this.getCartItemsByUser();
    }
    this.selectedProducts.selectedItems = [];
  }

  getCartItemsByUser() {
    this.loaderService.display(true);
    this.cartService.getCartListByUser(this.userDetails['_id']).subscribe(data=>{
      this.setCartData(data);
      this.loaderService.display(false);
    }) 
  }

  setCartData(data) {
    this.cartList = data;
    this.setUnfilteredData(data);
    this.getProductImageToBeShown();
    this.setHeaderCartItemBadge(data.length);
  }

  setHeaderCartItemBadge(cartItemsLength) {
    this.cartService.cartItemChange.next(cartItemsLength);
  }

  setUnfilteredData(data) {
    this.unfilteredCartItems = data;
  }

  getCartItemsAll() {
    this.loaderService.display(true);
    this.cartService.getCartListAll().subscribe(data=>{
      this.setCartData(data);
      this.loaderService.display(false);
    }) 
  }

  getProductImageToBeShown() {
    for(const cartItem of this.cartList) {
      cartItem.productImagesToBeShown= this.productService.getAllProductImagesToBeShown(cartItem.productImages);
    }
  }

  confirmOrder(cartItem, isMultipleItems?) {
    this.openOrderConfirmationModal(cartItem , isMultipleItems);
  }

  // deleteCartItem(cartItem) {
  //   this.cartService.deleteCartItem(cartItem._id).subscribe(response=>{
  //      this.getCartItemsByPrivileges();
  //   })
  // }

  
  setUserDetails() {
    if(this.selectedProducts.selectedItems.length > 0)
    this.selectedProducts.userName = this.selectedProducts.selectedItems[0].userName;
    this.selectedProducts.userAddress = this.selectedProducts.selectedItems[0].userAddress;
    this.selectedProducts.userPhoneNumber = this.selectedProducts.selectedItems[0].userPhoneNumber;
  }

  openOrderConfirmationModal(cartItem, isMultipleItems?): void{
    let modalObj: any;
    if(isMultipleItems) {
      this.setUserDetails();
      modalObj = {
        initialState: {
          productList: this.selectedProducts
        },
        class: this.orderConfirmationClass
      }
    }
    else {
      modalObj = {
        initialState: {
          product: cartItem
        },
        class: this.orderConfirmationClass
      }
    }
    const config= this.commonService.getModalConfig(this.orderConfirmationClass);
    this.modalRef = this.modalService.show(ConfirmOrderDetailsComponent, modalObj);
    this.modalRef.content.event.subscribe(data=>{
      this.placeOrder(data);
    });
  }

  placeOrder(data) {
    if(this.selectedProducts.selectedItems.length>0) {
      this.placeMultipleOrder(data);
    }
    else {
      this.placeSingleOrder(data);
    }
  }

  placeSingleOrder(cartItem) {
    this.orderService.addToOrderList(cartItem).subscribe(response=>{
      this.notifierService.notify('success', 'order placed successfully!');
      this.showFireCrackers();
      const placedOrder = true;
      this.deleteCartItem(cartItem, placedOrder);
    })
  }

  placeMultipleOrder(data) {
    this.setUpdatedDetails(data);
    this.orderService.addMultipleOrderToOrderList(this.selectedProducts).subscribe(response=>{
      this.notifierService.notify('success', 'order placed successfully!');
      this.showFireCrackers();
      this.getCartItemsByPrivileges();
    })
  }

  showFireCrackers() {
    this.isFireCrackerShown= true;
    setTimeout(()=>{
      this.isFireCrackerShown = false;
    }, this.commonService.fireCrackersTimeout);
  }

  setUpdatedDetails(data) {
    this.selectedProducts.userAddress = data.userAddress;
    this.selectedProducts.userPhoneNumber = data.userPhoneNumber;
  }

  decrementQuantity(cartItem, index) {
    this.commonService.decrementQuantity(cartItem);
    if(cartItem.isSelected) { 
      this.selectedProducts.price -= cartItem.price;
    }
  }

  incrementQuantity(cartItem, index) {
    this.commonService.incrementQuantity(cartItem);
    if(cartItem.isSelected) { 
      this.selectedProducts.price += cartItem.price;
    }
  }

  deleteCartItem(cartItem, placedOrder?) {
    let result=placedOrder || this.commonService.confirmAction();
      if(result) {
        this.loaderService.display(true);
        this.cartService.deleteCartItem(cartItem._id).subscribe(response =>{
          this.loaderService.display(false);
          if(!placedOrder) {
            this.notifierService.notify('success', 'cart Item deleted successfully!');
          }
          this.getCartItemsByPrivileges();
        });
    }
  }

  deleteSelectedCartItems() {
    let result=this.commonService.confirmAction();
    if(result) {
      this.loaderService.display(true);
      this.cartService.deleteMultipleCartItems(this.selectedProducts.selectedItems).subscribe(response =>{
        this.loaderService.display(false);
        this.notifierService.notify('success', 'cart Items deleted successfully!');
        this.getCartItemsByPrivileges();
      });
    }
  }   

  toggleCheckboxSelection(cartItem, index) {
    if(cartItem.isSelected) {
      this.selectedProducts.selectedItems.push(cartItem);
      this.increamentAddedItemPrice(cartItem);
    }
    else {
      this.removeItemsFromSelectedProducts(cartItem);
      this.decreamentRemovedItemPrice(cartItem);
    }
    this.setSelectedDeselectedAllText();
    this.updateMultipleSelectedActionbtnVisibility();
  }

  removeItemsFromSelectedProducts(cartItem) {
    const selectedItems= this.selectedProducts.selectedItems;
     for(let i=0;i< selectedItems.length; i++) {
       if(selectedItems[i]._id == cartItem._id) {
          selectedItems.splice(i,1);
       }
     }
  }

  setSelectedDeselectedAllText() {
    if(this.selectedProducts.selectedItems.length == this.cartList.length) {
      this.selectAllActive = true;
      this.currentSelectionText = this.deselectText;
    }
    else {
      this.selectAllActive = false;
      this.currentSelectionText = this.selectText;
    }
  }

  increamentAddedItemPrice(cartItem) {
    this.selectedProducts.price += cartItem.price*cartItem.quantity;
  }

  decreamentRemovedItemPrice(cartItem) {
    this.selectedProducts.price -= cartItem.price*cartItem.quantity;
  }

  updateMultipleSelectedActionbtnVisibility() {
    if(this.selectedProducts.selectedItems.length>0) {
      this.showMultiSelectedActionbtns = true;
    }
    else {
      this.showMultiSelectedActionbtns = false;
    }

  }

  selectDeselectAllItems() {
    if(!this.selectAllActive) {
      this.selectAllItems();
    }
    else {
      this.deselectAllItems();
    }
  }

  selectAllItems() {
    this.selectedProducts.price = 0;
    this.selectAllActive = true;
    this.currentSelectionText = this.deselectText;
    this.showMultiSelectedActionbtns = true;
    this.selectedProducts.selectedItems = this.commonService.deepCloneArray(this.cartList);
    this.cartList.map(data=>{
      data.isSelected = true;
      this.selectedProducts.price += data.price*data.quantity;
    })
  }

  deselectAllItems() {
    this.selectAllActive = false;
    this.currentSelectionText = this.selectText;
    this.showMultiSelectedActionbtns = false;
    this.selectedProducts.selectedItems = [];
    this.cartList.map(data=>{
      data.isSelected = false;
      this.selectedProducts.price -= data.price*data.quantity;
    })
  }

  confirmMultipleOrder() {
    
  }
}
