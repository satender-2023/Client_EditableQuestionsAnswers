import { Component, OnInit } from '@angular/core';
import { AddPhotosComponent } from '../modals/add-photos/add-photos.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-gallery-by-category',
  templateUrl: './gallery-by-category.component.html',
  styleUrls: ['./gallery-by-category.component.scss']
})
export class GalleryByCategoryComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(
    private commonService: CommonService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
  }
  openAddPhotosModal(): void{
    // const initialState: any = {
    //   initialState: {
    //     product
    //   },
    //   class: this.orderConfirmationClass
    // };
    const config= this.commonService.getModalConfig();
    this.modalRef = this.modalService.show(AddPhotosComponent);
    // this.modalRef.content.event.subscribe(data=>{
    //   this.placeOrder(data);
    // });
  }
}
