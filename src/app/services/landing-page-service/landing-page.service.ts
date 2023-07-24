import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { CommonService } from '../common-service/common.service';
import { LoaderService } from '../loader-service/loader.service';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
  orderUrl: string;
  orderAllUrl: string;
  private data = new BehaviorSubject(null);
  currentData = this.data.asObservable();
  confirmationText = "Are you sure you want to delete";
  $urlSearchVal = new Subject();
  orderDataSearch = new Subject();
  landingPageDetailsUrl: string;
  productPerCategoryUrl: string;
  categoryUrl: string;
  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router) {
      this.landingPageDetailsUrl = this.commonService.finalLandingPageDetailsUrl;
      this.productPerCategoryUrl = this.commonService.finalProductPerCategoryUrl;
      this.categoryUrl = this.commonService.finalCategoryUrl;
  }

  /*-------------for orders----------*/

  getLandingPageDetails() {
    return this.http.get(this.landingPageDetailsUrl);
  }

  getProductPerCategory() {
    return this.http.get(this.productPerCategoryUrl);
  }

  getAllCategories() {
    return this.http.get(this.categoryUrl);
  }
}
