import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blogs-by-category',
  templateUrl: './blogs-by-category.component.html',
  styleUrls: ['./blogs-by-category.component.scss']
})
export class BlogsByCategoryComponent implements OnInit {

  constructor() { }
  urls = [];
  ngOnInit(): void {
  }
  allowDrop(event: Event) {
    event.preventDefault();
  }

  drag(event: DragEvent) {
    event.dataTransfer!.setData('text', (event.target as HTMLElement).id);
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
}
