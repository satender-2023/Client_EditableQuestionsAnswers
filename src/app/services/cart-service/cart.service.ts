import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { CommonService } from '../common-service/common.service';
import { LoaderService } from '../loader-service/loader.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  filterData: any;
  currentQuestionTypeSelected: String;
  currentSearchString: String;
  cartUrl: string;
  cartAllUrl: string;
  multipleCartItemsUrl: string;
  private data = new BehaviorSubject(null);
  currentData = this.data.asObservable();
  confirmationText = "Are you sure you want to delete";
  $urlSearchVal = new Subject();
  cartDataSearch = new Subject();
  cartItemChange = new Subject();
  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router) {
      this.cartAllUrl = this.commonService.finalCartAllUrl;
      this.cartUrl = this.commonService.finalCartUrl;
      this.multipleCartItemsUrl = this.commonService.finalMultipleCartItemsUrl;
  }

  /*-------------for question answers----------*/

  getCartListByUser(userId) {
    return this.http.get(this.cartUrl+'/'+userId);
  }

  getCartListAll() {
    return this.http.get(this.cartAllUrl);
  }

  addToCartList(data) {
    return this.http.post(this.cartUrl, data);
  }

  // addToCartListByUserId(userId, data) {
  //   this.finalCartByUserNameUrl = this.finalCartByUserNameUrl+'/'+userId;
  //   return this.http.post(this.finalCartByUserNameUrl, data);
  // }

  deleteCartItem(id) {
    return this.http.delete(this.cartUrl + "/" + id);
  }

  updateCartList(data) {
    return this.http.patch(this.cartUrl + '/' + data._id, data);
  }

  deleteMultipleCartItems(data) {
    return this.http.post(this.multipleCartItemsUrl, data);
  }
}
