import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { BlogService } from 'src/app/services/blog/blog.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  @Input() cardData: any; // Replace with your actual card data type
  p: number = 1;

  editMode = {
    status: false,
    editedItem: {}
  };
  blogs: any;
  isAdmin: boolean = false;
  categorySelectedObj = {

    isAllCategorySelected: true
  };
  editIconTag = 'svg';
  isCategoryOpen = false;
  isMobile = false;
  sideBarCloseStatus = 'close';
  deleteIconTag = 'path';
  isAllCategoryActive = true;
  activeIndex = -1;
  constructor(
    private commonService: CommonService,
    private loaderService: LoaderService,
    private blogService: BlogService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.commonService.refreshCategory.subscribe((data) => {
      this.getBlogs();
    })

    this.getBlogs()
    this.setPrivileges();
  }

  setPrivileges() {
    this.isAdmin = this.commonService.userDetails.isAdmin;
  }
 
  getBlogs() {
    this.loaderService.display(true);
    this.blogService.getBlogsList().subscribe(data => {
      this.blogs = data;
      this.refreshProductAndSetCategoriesGlobally(data);
      this.loaderService.display(false);
    })
  }

  refreshProductAndSetCategoriesGlobally(data) {
    this.commonService.refreshProduct.next(this.categorySelectedObj)
    this.commonService.setCategoriesGlobally(data);
  }

  deleteProduct(id) {
    let result = this.commonService.confirmAction();
    if (result) {
      this.loaderService.display(true);
      alert("success, blog deleted successfully!")
      this.blogService.deleteBlogs(id).subscribe(data => {
        this.getBlogs();
        this.loaderService.display(false);
      })

    }
  }

  editProduct(id) {
    this.router.navigate(['/blogs', 'edit', id]);
  }
}
