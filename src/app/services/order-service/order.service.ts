import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { CommonService } from '../common-service/common.service';
import { LoaderService } from '../loader-service/loader.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderUrl: string;
  orderAllUrl: string;
  multipleOrderUrl: string;
  private data = new BehaviorSubject(null);
  currentData = this.data.asObservable();
  confirmationText = "Are you sure you want to delete";
  $urlSearchVal = new Subject();
  orderDataSearch = new Subject();
  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router) {
      this.orderUrl = this.commonService.finalOrderUrl;
      this.orderAllUrl = this.commonService.finalOrderAllUrl;
      this.multipleOrderUrl = this.commonService.finalMultipleOrderUrl;
  }

  /*-------------for orders----------*/

  getOrderListByUser(userId) {
    return this.http.get(this.orderUrl+'/'+userId);
  }

  getOrderListAll() {
    return this.http.get(this.orderAllUrl);
  }

  addToOrderList(data) {
    return this.http.post(this.orderUrl, data);
  }

  // addToCartListByUserId(userId, data) {
  //   this.finalCartByUserNameUrl = this.finalCartByUserNameUrl+'/'+userId;
  //   return this.http.post(this.finalCartByUserNameUrl, data);
  // }

  addMultipleOrderToOrderList(data) {
    return this.http.post(this.multipleOrderUrl, data);
  }

  deleteOrderItem(id) {
    return this.http.delete(this.orderUrl + "/" + id);
  }

  updateOrderList(data) {
    return this.http.patch(this.orderUrl + '/' + data._id, data);
  }
}
