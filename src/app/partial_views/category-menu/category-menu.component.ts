import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { ProductService } from 'src/app/services/product-service/product.service';
import { faTrash,faEdit, faChevronDown, faChevronUp, faGlobe } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-category-menu',
  templateUrl: './category-menu.component.html',
  styleUrls: ['./category-menu.component.scss']
})
export class CategoryMenuComponent implements OnInit {
  
  products: any;
  categories: any;
  faTrash = faTrash;
  faEdit = faEdit;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp
  faGlobe = faGlobe;
  isAllCategoryActive = true;
  editMode = { 
    status: false, 
    editedItem: {} 
  };
  activeIndex=-1;
  allCategoryText = 'All';
  editIconTag = 'svg';
  deleteIconTag = 'path';
  isAdmin = false;
  categorySelectedObj = {
    isAllCategorySelected: true
  };
  isCategoryOpen = false;
  isMobile = false;
  sideBarCloseStatus = 'close';

  constructor(
    private loaderService: LoaderService,
    private productService: ProductService,
    private commonService: CommonService
    ) { }

  ngOnInit(): void {
    this.handleSubscriptions();
    this.setPrivileges();
    this.getCategories();
    this.setWindowResizeEvent();
    this.setIsMobile();
  }

  setWindowResizeEvent() {
    window.onresize = () => {
      this.setIsMobile();
    };
  }
  
  handleSubscriptions() {
    this.handleRefreshCategorySubscription();
    this.handleUserLoggedInSubscriptions();
  }

  handleUserLoggedInSubscriptions() {
    this.commonService.userLoggedIn.subscribe(data => {
      this.setPrivileges();
    })
  }

  setIsMobile() {
    this.isMobile = this.commonService.checkAndSetIfMobile();
  }

  setPrivileges() {
    this.isAdmin = this.commonService.userDetails.isAdmin;
  }

  handleRefreshCategorySubscription() {
    this.commonService.refreshCategory.subscribe(data=>{
       this.getCategories();
    })
  }

  getCategories() {
    this.loaderService.display(true);
    this.productService.getCategoryList().subscribe(data=>{
       this.categories = data;
       this.refreshProductAndSetCategoriesGlobally(data);
       this.loaderService.display(false);
    })
  }

  refreshProductAndSetCategoriesGlobally(data) {
    this.commonService.refreshProduct.next(this.categorySelectedObj)
    this.commonService.setCategoriesGlobally(data);
  }

  deleteCategory(id) {
    let result=this.commonService.confirmAction();
    if(result) {
    this.loaderService.display(true);
    this.productService.deleteCategory(id).subscribe(data=>{
      this.getCategories();
      this.loaderService.display(false);
    })
   }
  }

  editCategory(item){
    let editedItem=JSON.parse(JSON.stringify(item));
    this.editMode={ 
      status: true,
      editedItem: editedItem
    };
  }

  onCategorySelected(event, data, i) {
    const currentTagName = event.target.tagName;
    if(currentTagName !== this.editIconTag && currentTagName !== this.deleteIconTag) {
      this.setActiveIndex(i);
      this.isAllCategoryActive = false;
      this.commonService.refreshProduct.next(data);
      this.commonService.sideBarStatus.next(this.sideBarCloseStatus);
    }
  }

  allCategorySelected() {
    this.setActiveIndex(-1);
    this.isAllCategoryActive = true;
    this.commonService.refreshProduct.next(this.categorySelectedObj);
    this.commonService.sideBarStatus.next(this.sideBarCloseStatus);
  }

  setActiveIndex(index) {
    this.activeIndex = index;
  }

  toggleCustomAccordion() {
   if(this.isCategoryOpen) {
     this.isCategoryOpen = false;
   }
   else {
    this.isCategoryOpen = true;
   }
  }

}
