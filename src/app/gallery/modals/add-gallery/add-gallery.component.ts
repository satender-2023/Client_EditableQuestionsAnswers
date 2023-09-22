import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { ProductService } from 'src/app/services/product-service/product.service';
import { CommonService } from 'src/app/services/common-service/common.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-add-gallery',
  templateUrl: './add-gallery.component.html',
  styleUrls: ['./add-gallery.component.scss']
})
export class AddGalleryComponent implements OnInit {
  gallery: any = {
    galleryName: '',
    galleryDescription: ''
  }
  constructor(public modalRef: BsModalRef, private http: HttpClient,
    private productService: ProductService,
    private loaderService: LoaderService,
    private notifierService: NotifierService,
    private commonService: CommonService,
  ) { }

  urls = [];
  ngOnInit(): void {
  }
  onselectFile(e: any) {
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.onload = (events: any) => {
          this.urls.push(events.target.result);
        }
      }
    }
  }
  save(): void {
    this.loaderService.display(true);
    this.productService.addGallery(this.gallery).subscribe(data => {
      this.loaderService.display(false);
      this.notifierService.notify('success', 'Gallery added successfully!');
    })
  }

  update(data) {
    this.loaderService.display(true);
    this.productService.addGallery(data).subscribe(data => {
      this.loaderService.display(false);
      this.handleCategoryChangeEvent(data);
    })
  }
  handleCategoryChangeEvent(data) {
    this.modalRef?.hide();
    // this.commonService.refreshCategoryEvent(data);
  }

}
