import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { QuestionAnswerService } from "../../services/question-answer-service/question-answer.service";
import { faTwitter, faFacebookF, faOpencart } from '@fortawesome/free-brands-svg-icons';
import { faBars, faSignInAlt, faUser, faUserCircle, faCartPlus, faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common-service/common.service';
import { ProductService } from 'src/app/services/product-service/product.service';
import { pageEnums } from './../../enums/page-enums';
import { CartService } from 'src/app/services/cart-service/cart.service';
import { OrderService } from 'src/app/services/order-service/order.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Output('sidebarStatus') sidebarStatus = new EventEmitter();
  @Output('openAboutUs') openAboutUs = new EventEmitter();
  questionTypes: any;
  faFacebook = faFacebookF;
  faTwitter = faTwitter;
  faBars = faBars;
  faUser = faUser;
  faOpencart = faOpencart;
  faSignInAlt = faSignInAlt
  faUserCircle = faUserCircle;
  faCartPlus = faCartPlus;
  faCartArrowDown = faCartArrowDown
  searchVal = '';
  userName: string;
  cartItems: any;
  userDetails: any;
  loginPage: boolean;
  isLandingPage: boolean;
  constructor(
    private questionAnswerService: QuestionAnswerService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private productService: ProductService,
    private cartService: CartService,
    private orderService: OrderService
  ) {
    this.checkRouterEvent();
  }

  ngOnInit(): void {
    this.handleUserLoggedInSubscriptions();
    this.setUserDetails();
    this.getCartItemsByPrivileges();
  }

  ngAfterViewInit() {
    this.handleCartItemChangeSubscriptions();
  }

  checkRouterEvent() {
    this.router.events.subscribe((val) => {
      this.checkIfLoginPage();
      this.checkIfLandingPage();
    });
  }

  checkIfLandingPage() {
    this.isLandingPage = this.commonService.checkIfLandingPage();
  }

  checkIfLoginPage() {
    let url = window.location.href;
    if (url.indexOf('login') > -1) {
      this.loginPage = true;
    }
    else {
      this.loginPage = false;
    }
  }

  handleCartItemChangeSubscriptions() {
    this.cartService.cartItemChange.subscribe(response => {
      if (response) {
        this.cartItems = response
      }
      else {
        this.getCartItemsByPrivileges();
      }
    });
  }

  handleUserLoggedInSubscriptions() {
    this.commonService.userLoggedIn.subscribe(data => {
      this.userName = data['userName'];
      this.userDetails = data;
      this.getCartItemsByPrivileges();
    })
  }

  setUserDetails() {
    if (!this.userName && this.commonService.userDetails) {
      this.userName = this.commonService.userDetails.userName;
      this.userDetails = this.commonService.userDetails;
    }
    else {
      this.userDetails = {
        visitor: true
      }
    }
  }

  logOut() {
    this.commonService.removeUserDetails();
    this.removeUserName();
    this.navigateToLoginPage();
  }

  removeUserName() {
    this.userName = '';
  }

  navigateToLoginPage() {
    this.router.navigate(['/login']);
  }

  openSiderBar(): void {
    this.sidebarStatus.emit('open');
  }
  getQuestionTypes() {
    this.questionAnswerService.getQuestionTypes().subscribe(response => {
      this.questionTypes = response;
    });
    console.log(this.questionTypes);
  }
  onOptionsSelected(value) {
    this.questionAnswerService.filterDataByQuestionType(value);
  }

  checkCurrentUrl(value) {
    let currentUrl = window.location.href;
    return currentUrl.indexOf(value) > -1;
  }

  searchByPage(value) {
    switch (true) {
      case this.checkCurrentUrl(pageEnums.products):
        this.productService.productDataSearch.next(value);
        break;
      case this.checkCurrentUrl(pageEnums.carts):
        this.cartService.cartDataSearch.next(value);
        break;
      case this.checkCurrentUrl(pageEnums.orders):
        this.orderService.orderDataSearch.next(value);
        break;
      default:
        break;
    }
  }

  checkEnterKeyPressed(value, event) {
    if (event.key == "Enter") {
      this.searchByPage(value)
    }
  }
  openAboutusModal(): void {
    this.openAboutUs.emit()
  }

  getCartItemsByPrivileges() {
    if (this.userDetails.isAdmin) {
      this.getCartItemsAll();
    }
    else {
      this.getCartItemsByUser();
    }
  }

  getCartItemsByUser() {
    this.cartService.getCartListByUser(this.userDetails['_id']).subscribe(data => {
      this.cartItems = data['length'];
    })
  }

  getCartItemsAll() {
    this.cartService.getCartListAll().subscribe(data => {
      this.cartItems = data['length'];
    })
  }
}
