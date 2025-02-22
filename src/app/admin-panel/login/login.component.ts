import { Component, OnInit } from '@angular/core';
import {QuestionAnswerService} from '../../services/question-answer-service/question-answer.service';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product-service/product.service';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { CommonService } from 'src/app/services/common-service/common.service';
import { AddressService } from 'src/app/services/address/address.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isSignUpMode = false;
  faArrowRight = faArrowRight;
  public isPractitioner: boolean;
  login:any={username:"",password:""};
  public states = [];

  constructor(
    private productService :ProductService,
    private commonService: CommonService,
    private router:Router,
    private addressService: AddressService,
  ) {
    this.states = this.addressService.getStateList();
  }

  ngOnInit(): void {
    if(localStorage.getItem('loggedIn')=="true") {
      this.router.navigateByUrl('/home');
    }
  }

  
  loginToApplication() {
    if(this.isSignUpMode) {
       this.signUpUser();
    }
    else {
       this.validateLoginDetails();
    }
  }

  signUpUser() {
     this.productService.signUpUser(this.login).subscribe(data=>{
        console.log('Registration successfull');
        this.validateLoginDetails();
     })
  }

  setPrivilegesOfUser(data) {
    if(data['isAdmin']) {
      localStorage.setItem('loggedIn','true');
      localStorage.setItem('isAdmin','true');
      this.setLoggedInUserDetails(data);
      this.router.navigateByUrl('/home');
   }
   else if(data) {
     localStorage.setItem('loggedIn','true');
     localStorage.setItem('isAdmin','false');
     this.setLoggedInUserDetails(data);
     this.router.navigateByUrl('/home');
   }
   else {
     localStorage.removeItem('loggedIn');
     localStorage.removeItem('isAdmin');
     this.removeUserDetails();
     alert('invalid user, please enter correct username or password');
   }
  }

  removeUserDetails(){
    this.commonService.removeUserDetails();
  }

  setLoggedInUserDetails(userDetails) {
    const formattedUserDetails ={
      userName: userDetails.username,
      firstName: userDetails.firstName, //new
      middleName: userDetails.middleName, //new
      lastName: userDetails.lastName, //new
      address: userDetails.address,
      city: userDetails.city,
      state: userDetails.state,
      pincode: userDetails.pincode,
      isPractitioner: userDetails.isPractitioner,
      regNumber: userDetails.regNumber,
      phoneNumber: userDetails.phoneNumber,
      isAdmin: userDetails.isAdmin,
      _id: userDetails._id
    }
    this.commonService.setUserDetails(formattedUserDetails);
  }

  validateLoginDetails() {
    this.productService.validateLoginDetails(this.login).subscribe(data=>{
       if(data && data['invalidUser']) {
         alert('incorrect credentials');
       }
       else {
         this.setPrivilegesOfUser(data);
       }
     })
  }

  keyPressEvent(event) {
    if(event.keyCode==13) {
      this.validateLoginDetails();
    }
  }
  keyPressEventForCharacter(event: KeyboardEvent): void {
    const charCode = event.charCode || event.keyCode;
    const char = String.fromCharCode(charCode);

    if (!/^[a-zA-Z]*$/.test(char) && charCode !== 8) {
      event.preventDefault();
    }
  }

  setSignUpMode() {
    this.isSignUpMode = true;
  }

  setLoginMode() {
    this.isSignUpMode = false;
  }
}
