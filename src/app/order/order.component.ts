import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart-service/cart.service';
import { CommonService } from '../services/common-service/common.service';
import { OrderService } from '../services/order-service/order.service';
import { ProductService } from '../services/product-service/product.service';
import { faCheckSquare, faClock, faUserClock } from '@fortawesome/free-solid-svg-icons';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { LoaderService } from '../services/loader-service/loader.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { showIndicators: false } }
  ]
})
export class OrderComponent implements OnInit {
  productImages: any[];
  userDetails: any;
  orderList: any;
  faCheckSquare = faCheckSquare;
  faClock = faClock;
  faUserClock = faUserClock;
  unfilteredOrderedItems: any;
  currentCurrency: string;
  dateNotAvailableText = 'NA';
  faTrash = faTrash;
  showOrderDeliveryNotification;

  constructor(
    private commonService: CommonService,
    private productService: ProductService,
    private orderService: OrderService,
    private loaderService: LoaderService,
    private notifierService: NotifierService
    ) { 
      this.userDetails = this.commonService.userDetails;
      this.checkIfOrderDeliveryNotificationToBeshown();
    }

  ngOnInit(): void {
    this.setCurrentCurrency();
    this.getOrdersByUserPrivileges();
    this.handleOrderSearchSubsriptions();
  }

  checkIfOrderDeliveryNotificationToBeshown() {
    let flag = localStorage.getItem('showOrderDeliveryNotification');
    if(flag) {
      this.showOrderDeliveryNotification = false;
    }
    else {
      this.showOrderDeliveryNotification = true;
    }
  }

  getFormattedOrderDate(date) {
    if(date) {
      return new Date(parseInt(date)).toDateString();
    }
    else {
      return this.dateNotAvailableText;
    }
  }

  setCurrentCurrency() {
    this.currentCurrency = this.commonService.currentCurrency;
  }

  handleOrderSearchSubsriptions() {
    this.orderService.orderDataSearch.subscribe(data=>{
       this.orderList = this.commonService.filterDataBySearchString(this.unfilteredOrderedItems,data);
    })
  }

  getOrdersByUserPrivileges() {
    if(this.userDetails.isAdmin) {
      this.getOrderedItemsAll();
    }
    else {
      this.getOrderedItemsByUser();
    }
  }

  getOrderedItemsByUser() {
    this.loaderService.display(true);
    this.orderService.getOrderListByUser(this.userDetails['_id']).subscribe(data=>{
      this.setOrderedItems(data);
      this.loaderService.display(false);
    }) 
  }

  getOrderedItemsAll() {
    this.loaderService.display(true);
    this.orderService.getOrderListAll().subscribe(data=>{
      this.setOrderedItems(data);
      this.loaderService.display(false);
    }) 
  }

  setOrderedItems(data) {
    this.orderList = data;
    this.unfilteredOrderedItems = data;
    this.getProductImageToBeShown();
  }

  getProductImageToBeShown() {
    for(const orderedItem of this.orderList) {
      orderedItem.productImagesToBeShown= this.productService.getAllProductImagesToBeShown(orderedItem.productImages);
    }
  }

  acceptOrder(orderedItem) {
    orderedItem.orderAccepted = true;
    this.orderService.updateOrderList(orderedItem).subscribe(response=>{
      this.getOrdersByUserPrivileges();
    });
  }

  deleteOrder(orderedItem) {
    let result = this.commonService.confirmAction();
    if(result) {
      this.loaderService.display(true);
      this.orderService.deleteOrderItem(orderedItem._id).subscribe(response=> {
        this.loaderService.display(false);
        this.notifierService.notify('success', 'order deleted successfully!');
        this.getOrdersByUserPrivileges();
      })
    }
  }

  onClosed() {
    this.showOrderDeliveryNotification = false;
    localStorage.setItem('showOrderDeliveryNotification', this.showOrderDeliveryNotification.toString());
  }
}
