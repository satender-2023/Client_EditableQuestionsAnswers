import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ConfirmOrderDetailsComponent } from 'src/app/products/modals/confirm-order-details/confirm-order-details.component';
import { OrderService } from '../order-service/order.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  currentSearchString: String;
  outOfStockText = 'Out of stock';
  sellerStocksEmptyText ='Seller stock is empty'
  loginDetailsUrl: String = "/api/loginDetails";
  signUpUrl = "/api/signUp";
  productUrl: string = "/api/product";
  categoryUrl: string = "/api/category";
  blogsUrl: string = "/api/blogs"; //blogs URL
  galleryUrl: string = "/api/gallery"; //blogs URL
  cartUrl: string = "/api/cart";
  cartAllUrl = '/api/cartAll';
  orderUrl = "/api/order";
  multipleOrderUrl = "/api/multipleOrder";
  multipleCartItemsUrl = "/api/multipleCartItems"
  orderAllUrl = "/api/orderAll";
  productAllUrl = "/api/productAll";
  landingPageDetailsUrl = "/api/landingPageDetails";
  productPerCategoryUrl = "/api/productPerCategory";
  isProd: boolean = false;
 // prodUrl: String = "https://46.101.150.128";
  prodUrl: String = "https://rasahriday.com"
  devDomain: any = this.isProd ? this.prodUrl : "http://localhost:3000";
  finalloginDetailsUrl: string = this.devDomain + this.loginDetailsUrl;
  finalSignUpUrl = this.devDomain + this.signUpUrl;
  finalProductUrl: string = this.devDomain + this.productUrl;
  finalCategoryUrl: string = this.devDomain + this.categoryUrl;
  finalOrderUrl = this.devDomain + this.orderUrl;
  finalOrderAllUrl = this.devDomain + this.orderAllUrl;
  finalMultipleOrderUrl = this.devDomain + this.multipleOrderUrl;
  finalProductAllUrl = this.devDomain + this.productAllUrl;
  finalLandingPageDetailsUrl = this.devDomain + this.landingPageDetailsUrl;
  finalProductPerCategoryUrl = this.devDomain + this.productPerCategoryUrl;
  finalCartUrl = this.devDomain + this.cartUrl;
  finalCartAllUrl = this.devDomain + this.cartAllUrl;
  finalMultipleCartItemsUrl = this.devDomain + this.multipleCartItemsUrl;
  finalBlogsUrl = this.devDomain + this.blogsUrl;
  finalGalleryUrl = this.devDomain + this.galleryUrl;
  userDetails: any;
  confirmationText = "Are you sure you want to delete";
  refreshCategory = new Subject();
  refreshBlogs = new Subject();
  refreshProduct = new Subject();
  userLoggedIn = new Subject();
  sideBarStatus = new Subject();
  categoryMenus;
  blogsMenus;
  currentCurrency = '₹';
  modalClass = 'modal-dialog-container';
  orderConfirmationClass='order-confirmation';
  modalRef: any;
  visitorObj = {
    isVisitor: true
  }
  isMobile: boolean;
  mobileWidth = 768;
  fireCrackersTimeout = 4000;
 

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.checkAndSetIfMobile();
    this.setWindowResizeEvent();
  }

  setUserDetails(userDetails) {
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    this.userDetails = userDetails;
    this.userLoggedInEvent(userDetails);
  }

  openOrCloseSideBar(status) {
    this.sideBarStatus.next(status);
  }

  checkAndSetIfMobile() {
    if(window.innerWidth < 768) {
      this.isMobile = true;
      return true;
    }
    else {
      this.isMobile = false;
      return false;
    }
  }

  setWindowResizeEvent() {
    window.onresize = () => {
      this.checkAndSetIfMobile();
    };
  }

  getUserDetails() {
    let retrievedDetails = localStorage.getItem('userDetails');
    if (retrievedDetails) {
      this.userDetails = JSON.parse(retrievedDetails);
    }
  }

  userLoggedInEvent(userDetails) {
    this.userLoggedIn.next(userDetails);
  }

  removeUserDetails() {
    localStorage.removeItem('userDetails');
    localStorage.removeItem('loggedIn');
    this.userDetails = this.visitorObj;
    this.userLoggedIn.next(this.userDetails)
  }

  refreshCategoryEvent(data) {
    this.refreshCategory.next(data);
  }
  refreshBlogsEvent(data) {
    this.refreshBlogs.next(data);
  }
  refreshProductEvent(data) {
    this.refreshProduct.next(data);
  }

  confirmAction() {
    let result = confirm(this.confirmationText);
    return result;
  }

  checkIfVisitorAndNavigate() {
    if(this.userDetails && this.userDetails.isVisitor) {
      return true;
    }
  }

  navigateToLoginPage() {
    this.router.navigate(['/login']);
  }

  getModalConfig(className?) {
    const config: ModalOptions = {
      backdrop: 'static',
      keyboard: false,
      animated: true,
      ignoreBackdropClick: true,
      class: className ? className : this.modalClass
    };
    return config;
  }

  setCategoriesGlobally(data) {
    this.categoryMenus = data;
  }
  setBlogsGlobally(data) {
    this.blogsMenus = data;
  }
  getBlogs() {
    return this.blogsMenus;
  }
  getCategories() {
    return this.categoryMenus;
  }

  handleFilteringOfDataBySearchString(products, searchVal) {
    let lowerCaseSearchValue = searchVal.toLowerCase();
    let filteredData = products.filter(data => {
      return (data.productName.toLowerCase().indexOf(lowerCaseSearchValue) > -1 ||
        data.description.toLowerCase().indexOf(lowerCaseSearchValue) > -1) ||
        this.checkOrderedDate(data.orderedDate, lowerCaseSearchValue) ||
        this.checkUserDetails(data, lowerCaseSearchValue)
    })
    return filteredData;
  }

  checkUserDetails(data, lowerCaseSearchValue) {
    if (data.userName && data.userPhoneNumber) {
      if (data.userName.toLowerCase().indexOf(lowerCaseSearchValue) > -1 ||
        data.userPhoneNumber.toLowerCase().indexOf(lowerCaseSearchValue) > -1) {
        return true;
      }
    }
    return false;
  }

  checkOrderedDate(orderedDate, searchVal) {
    if (orderedDate) {
      let formattedOrderedDate = new Date(parseInt(orderedDate)).toDateString().toLowerCase();
      if (formattedOrderedDate.indexOf(searchVal) > -1) {
        return true;
      }
    }
    return false;
  }

  filterDataBySearchString(products, value) {
    let urlParam = this.route.snapshot.paramMap.get('searchKey');
    if (urlParam !== value) {
      this.router.navigate(['/products', value], { relativeTo: this.route });
    }
    this.currentSearchString = value;
    return this.handleFilteringOfDataBySearchString(products, value);
  }

  getProductImageToBeShown(productImage) {
    let url = this.devDomain;
    if (productImage) {
      return url + '/' + productImage.split(',')[0];
    }
    return null;
  }

  observerCallback(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // fade in observed elements that are in view
        entry.target.classList.replace('fadeOut', 'fadeIn');
        let element: HTMLElement = document.querySelectorAll('.carousel-indicators > li.active')[1] as HTMLElement;
        element.click();
      } else {
        // fade out observed elements that are not in view
        entry.target.classList.replace('fadeIn', 'fadeOut');
      }
    });
  }

  addFadeObserver() {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.7
    };

    const observer = new IntersectionObserver(this.observerCallback, observerOptions);

    const fadeElms = document.querySelectorAll('.fade');
    fadeElms.forEach(el => observer.observe(el));
  }

  addUserDetails(data) {
    let userDetails = this.userDetails;
    data.userId = userDetails._id;
    data.userName = userDetails.userName;
    data.userAddress = userDetails.address;
    data.userPhoneNumber = userDetails.phoneNumber
  }

  decrementQuantity(product) {
    if (product.quantity > 0) {
      product.quantity -= 1;
    }
  }

  incrementQuantity(product) {
    if (!product.quantity) {
      product.quantity = 1;
    }
    product.quantity += 1;
  }

  deepClone(obj) {
    if (typeof obj !== 'object')
      return obj;

    let tempStorage = {};
    for (let key in obj) {
      tempStorage[key] = this.deepClone(obj[key]);
    }
    return tempStorage;
  }

  deepCloneArray(arrayItems){
    return JSON.parse(JSON.stringify(arrayItems));
  }

  checkIfLandingPage() {
    let url = window.location.href;
    if(url.indexOf('home')> -1) {
       return true;
    }
    else {
       return false;
    }
  }

  checkIfProductListingPage() {
    let url = window.location.href;
    if(url.indexOf('products')> -1) {
       return true;
    }
    else {
       return false;
    }
  }

  checkIfLoginPage() {
    let url = window.location.href;
    if (url.indexOf('login') > -1) {
      return true;
    }
    else {
      return false;
    }
  }

}
