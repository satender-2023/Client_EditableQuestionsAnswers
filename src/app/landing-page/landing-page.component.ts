import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { CommonService } from '../services/common-service/common.service';
import { LandingPageService } from '../services/landing-page-service/landing-page.service';
import { LoaderService } from '../services/loader-service/loader.service';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 10000, noPause: true, showIndicators: true } }
  ]
})
export class LandingPageComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer; 
  landingPageDetails: any;
  randomProductsArr=[];
  path = './../../assets/images/landingpage_img_';
  categoryPath = './../../assets/images/category_';
  imgFormat = '.png';
  mp4Format = '.mp4';
  itemsPerSlide = 3;
  singleSlideOffset = true;
  noWrap = true;
  slidesChangeMessage = '';
  productPerCategorySlides = [];
  showIndicator = true;

  constructor(
    private commonService: CommonService,
    private landingPageService: LandingPageService,
    private router: Router,
    private loaderService: LoaderService
  ) {
    
   }

  ngOnInit(): void {
   // this.getLandingPageDetails();
   this.getStaticLandingPageImages();
   this.getAllCategories();
   this.play();
  }

  ngAfterViewInit() {
    this.play();
  }

  onSlideRangeChange(indexes: number[]): void {
    this.slidesChangeMessage = `Slides have been switched: ${indexes}`;
  }

  addFadeAnimation() {
    this.commonService.addFadeObserver();
  }

  getStaticLandingPageImages() {
    for(let i=1;i<=4;i++){
       if(i==2) {
        this.randomProductsArr.push(this.path+i+this.mp4Format);
       }
       else {
        this.randomProductsArr.push(this.path+i+this.imgFormat);
       }
    }
  }

  getLandingPageDetails() {
     this.loaderService.display(true);
     this.landingPageService.getLandingPageDetails().subscribe(response=>{
      this.loaderService.display(false);
      this.landingPageDetails = response;
      this.getRandomProductsToShow();
     });
  }

  getRandomProductsToShow() {
    for(let i=0;i<3;i++){
      let index= Math.floor(Math.random()*this.landingPageDetails.length);
      while(this.landingPageDetails[index].productImages==null || this.landingPageDetails[index].productImages=="") {
        index = Math.floor(Math.random()*this.landingPageDetails.length);
      }
      let currentProductImage = this.commonService.getProductImageToBeShown(this.landingPageDetails[index].productImages);
      this.randomProductsArr.push(currentProductImage);
    }
  }

  showAllProducts() {
    this.router.navigate(["/products"]);
  }

  showCategories() {
    this.router.navigate(["/products"]);
  }

  setProductPerCategoryInSlides(response) {
    for(const [index,item] of response.entries()) {
       let imgObj = {
        image: this.categoryPath+item.categoryName.toLowerCase()+this.imgFormat,
        data: item
       }
       this.productPerCategorySlides.push(imgObj);
    }
    this.addFadeAnimation();
  }

  getAllCategories() {
    this.loaderService.display(true);
    this.landingPageService.getAllCategories().subscribe(response=>{
       this.loaderService.display(false);
       this.setProductPerCategoryInSlides(response);
    })
  }

  play() {
    if(this.videoPlayer && this.videoPlayer) {
      const media = this.videoPlayer.nativeElement;
      media.muted = true;
      media.play();
    }
  }
}
