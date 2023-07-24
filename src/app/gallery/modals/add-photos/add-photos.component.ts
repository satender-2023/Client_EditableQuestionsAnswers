import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-photos',
  templateUrl: './add-photos.component.html',
  styleUrls: ['./add-photos.component.scss']
})
export class AddPhotosComponent implements OnInit {

  constructor(public modalRef: BsModalRef, private http: HttpClient) { }

  urls = [];
  ngOnInit(): void {
  }
  onselectFile(e: any) {
    if (e.target.files) {
      for (let i = 0; i <  e.target.files.length; i++) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.onload = (events: any) => {
          this.urls.push(events.target.result);
        }
      }
    }
  }

}
