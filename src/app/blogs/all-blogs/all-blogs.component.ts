import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/services/common-service/common.service';
import { AddBlogsComponent } from '../add-blogs/add-blogs.component';

@Component({
  selector: 'app-all-blogs',
  templateUrl: './all-blogs.component.html',
  styleUrls: ['./all-blogs.component.scss']
})
export class AllBlogsComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(
    private commonService: CommonService,
    private modalService: BsModalService,
    ) { }

  ngOnInit(): void {
  }
  openAddBlogsModal(): void{
    // const initialState: any = {
    //   initialState: {
    //     product
    //   },
    //   class: this.orderConfirmationClass
    // };
    const config= this.commonService.getModalConfig();
    this.modalRef = this.modalService.show(AddBlogsComponent);
    // this.modalRef.content.event.subscribe(data=>{
    //   this.placeOrder(data);
    // });
  }
}
