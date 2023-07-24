import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoaderService } from './../../services/loader-service/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../common-service/common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  filterData: any;
  currentQuestionTypeSelected: String;
  currentSearchString: String;
  devDomain: string;
  finalloginDetailsUrl: string;
  finalSignUpUrl: string
  finalProductUrl: string;
  finalCategoryUrl: string;
  questionAnswerData: any;
  private data = new BehaviorSubject(null);
  currentData = this.data.asObservable();
  confirmationText = "Are you sure you want to delete";
  $urlSearchVal = new Subject();
  productDataSearch = new Subject();
  productAllUrl: any;
  
  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router) {
      this.devDomain = this.commonService.devDomain;
      this.productAllUrl = this.commonService.finalProductAllUrl;
      this.finalloginDetailsUrl = this.commonService.finalloginDetailsUrl;
      this.finalSignUpUrl = this.commonService.finalSignUpUrl;
      this.finalProductUrl = this.commonService.finalProductUrl;
      this.finalCategoryUrl = this.commonService.finalCategoryUrl;
  }

  /*---------------for login details-------------*/
  getloginDetails() {
    return this.http.get(this.finalloginDetailsUrl);
  }

  validateLoginDetails(data) {
    return this.http.post(this.finalloginDetailsUrl, data);
  }

  addloginDetails(data) {
    return this.http.post(this.finalloginDetailsUrl, data);
  }

  /*---for signup ---*/
  signUpUser(data) {
    return this.http.post(this.finalSignUpUrl, data);
  }

  setUrlSearchVal(urlSearchVal): void {
    this.$urlSearchVal.next(urlSearchVal);
  }

  getUrlSearchVal(): Observable<any> {
    return this.$urlSearchVal;
  }

  deleteloginDetails(id) {
    return this.http.delete(this.finalloginDetailsUrl + "/" + id);
  }

  updateloginDetails(data) {
    return this.http.patch(this.finalloginDetailsUrl + "/" + data._id, data);
  }

  /*-------------for question answers----------*/

  getProductListByCategoryId(categoryId) {
    return this.http.get(this.finalProductUrl+'?categoryId='+categoryId);
  }

  getAllProductList() {
    return this.http.get(this.productAllUrl);
  }

  addProduct(data) {
    return this.http.post(this.finalProductUrl, data);
  }

  deleteProduct(id) {
    return this.http.delete(this.finalProductUrl + "/" + id);
  }

  updateProduct(formData, data) {
    return this.http.patch(this.finalProductUrl + '/' + data._id, formData);
  }

  /*----categories---*/
  getCategoryList() {
    return this.http.get(this.finalCategoryUrl);
  }

  addCategory(data) {
    return this.http.post(this.finalCategoryUrl, data);
  }

  deleteCategory(id) {
    return this.http.delete(this.finalCategoryUrl + "/" + id);
  }

  updateCategory(data) {
    return this.http.patch(this.finalCategoryUrl + '/' + data._id, data);
  }
  /*---end categories---*/

  getProductImageToBeShown(productImage) {
    let url = this.devDomain;
    if(productImage) {
     return url + '/' + productImage.split(',')[0];
   }
   return null;
  }

  getAllProductImagesToBeShown(productImage) {
    let url = this.devDomain;
    if(productImage) {
      let allProductImages=productImage.split(',');
      let productArr=[];
      for(let image of allProductImages) {
         let productUrl=url + '/' + image;
         productArr.push(productUrl)
      }
      return productArr;
   }
   return null;
  }

  // filterDataByQuestionType(type) {
  //   this.currentQuestionTypeSelected = type;
  //   this.handleFilteringOfDataBySearchString();
  // }

  filterDataByQuestionTypeAndSearchString() {
    this.filterData = {}
    this.filterData = this.questionAnswerData.filter((item, index) => {
      return ((item.question.toUpperCase().indexOf(this.currentSearchString.toUpperCase()) > -1) && (item.questionType.toUpperCase() == this.currentQuestionTypeSelected.toUpperCase()));
    })
    this.data.next(this.filterData);
  }

  confirmAction() {
    let result = confirm(this.confirmationText);
    return result;
  }
}
