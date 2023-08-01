import { Component, OnInit } from '@angular/core';
import {SafeResourceUrlPipe} from 'src/app/pipes/safe-resource-url.pipe';

@Component({
  selector: 'app-blogs-by-category',
  templateUrl: './blogs-by-category.component.html',
  styleUrls: ['./blogs-by-category.component.scss'],
  providers: [SafeResourceUrlPipe]
})
export class BlogsByCategoryComponent implements OnInit {
  productImages =[];
  currentlyUploadedImageSrc = [];

  constructor(
    private safeResourceUrl: SafeResourceUrlPipe
    ) { }

  urls = [];
  ngOnInit(): void {
  }
  allowDrop(event: Event) {
    event.preventDefault();
  }

  drag(event: DragEvent) {
    event.dataTransfer!.setData('text', (event.currentTarget['parentElement'] as HTMLElement).id);
  }

  drop(event: DragEvent) {
    event.preventDefault();
    const data = event.dataTransfer!.getData('text');
    const dropzone = event.target as HTMLElement;
    dropzone.appendChild(document.getElementById(data)!);
  }

  // choose photos
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

  setCurrentlyUploadedImgArr(file) {
    let imgSrc=URL.createObjectURL(file)
    this.currentlyUploadedImageSrc.push(imgSrc);
  }

  getFiles(event) {
    this.productImages=[];
    for (var i = 0; i < event.target.files.length; i++) {
      this.productImages.push(event.target.files[i]);
      this.setCurrentlyUploadedImgArr(event.target.files[i]);
          // this.setCurrentlyUploadedImgArr(event.target.files[i])
    }
  }
}
