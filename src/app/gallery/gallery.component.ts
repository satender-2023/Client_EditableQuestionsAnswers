import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common-service/common.service';
import { AddGalleryComponent } from './modals/add-gallery/add-gallery.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { faTrash,faEdit } from '@fortawesome/free-solid-svg-icons';
import { AddCategoryComponent } from './modals/add-category/add-category.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  modalRef: BsModalRef;
  faTrash=faTrash;
  faEdit=faEdit;
  constructor(
    private commonService: CommonService,
    private modalService: BsModalService,
    ) { }

  ngOnInit(): void {
  }

  openAddGalleryModal(): void{
      // const initialState: any = {
      //   initialState: {
      //     product
      //   },
      //   class: this.orderConfirmationClass
      // };
      const config= this.commonService.getModalConfig();
      this.modalRef = this.modalService.show(AddGalleryComponent);
      // this.modalRef.content.event.subscribe(data=>{
      //   this.placeOrder(data);
      // });
    }

    openAddCategoryModal(): void{
      // const initialState: any = {
      //   initialState: {
      //     product
      //   },
      //   class: this.orderConfirmationClass
      // };
      const config= this.commonService.getModalConfig();
      this.modalRef = this.modalService.show(AddCategoryComponent);
      // this.modalRef.content.event.subscribe(data=>{
      //   this.placeOrder(data);
      // });
    }

}
