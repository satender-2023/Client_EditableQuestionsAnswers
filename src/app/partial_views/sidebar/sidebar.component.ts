import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { faBars, faSignInAlt, faUser, faUserCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CommonService } from 'src/app/services/common-service/common.service';
import { Router } from '@angular/router';
import { CategoryMenuComponent} from './../category-menu/category-menu.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input('isSideBarOpen') isSideBarOpen;
  @Output('sidebarStatus') sidebarStatus = new EventEmitter();
  @Output('openAboutUs') openAboutUs = new EventEmitter();
  faTimes = faTimes;
  faUserCircle = faUserCircle;
  // faFacebook = faFacebookF;
  // faTwitter = faTwitter;
  userName;
  isAdmin = false;
  isLandingPage: boolean;
  loginPage: boolean;
  isProductListingPage: boolean;
  constructor(
    private router: Router,
    private commonService: CommonService
    ) { 
      this.checkRouterEvent();
    }

  ngOnInit(): void {
    this.handleSubscriptions();
    this.setUserName();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.isSideBarOpen = changes.isSideBarOpen.currentValue;
  }

  
  checkRouterEvent() {
    this.router.events.subscribe((val) => {
      this.checkIfProductListingPage();
    });
  }

  checkIfLandingPage() {
    this.isLandingPage = this.commonService.checkIfLandingPage();
  }

  checkIfProductListingPage() {
    this.isProductListingPage = this.commonService.checkIfProductListingPage();
  }

  checkIfLoginPage() {
   this.loginPage = this.commonService.checkIfLoginPage();
  }

  handleSubscriptions() {
    this.commonService.userLoggedIn.subscribe(data=>{
      this.userName = data['userName'];
      this.isAdmin = data['isAdmin'];
    })
  }

  setUserName() {
    const userDetails = this.commonService.userDetails;
    if(!this.userName) {
      this.userName = userDetails.userName;
    }
    this.isAdmin = userDetails.isAdmin
  }

  logOut() {
    this.commonService.removeUserDetails();
    this.removeUserName();
    this.closeSideBar();
    this.navigateToLoginPage();
  }

  removeUserName() {
    this.userName ='';
  }

  navigateToLoginPage() {
    this.router.navigate(['/login']);
  }

  closeSideBar(): void{
    this.sidebarStatus.emit('close');
    this.isSideBarOpen = false;
  }

  openAboutusModal(): void{
     this.openAboutUs.emit();
  }

  setLoggedInUser() {
    this.userName = this.commonService.userDetails;
  }

}

