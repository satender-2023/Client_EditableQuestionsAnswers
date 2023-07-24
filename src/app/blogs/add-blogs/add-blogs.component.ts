import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-add-blogs',
  templateUrl: './add-blogs.component.html',
  styleUrls: ['./add-blogs.component.scss']
})

export class AddBlogsComponent implements OnInit {

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
  save() {
    const description = 'upload'; // Replace this with the actual description value
    const imageUrls = this.urls;

    // Replace 'YOUR_API_ENDPOINT' with the actual endpoint URL on your server to handle the save operation
    const saveEndpoint = 'https://jsonplaceholder.typicode.com/todos/1';

    const data = {
      description: description,
      imageUrls: imageUrls
    };

    this.http.post(saveEndpoint, data).subscribe(
      (response) => {
        // Handle the response from the server if needed
        console.log('Save successful:', response);

        // Clear the form after successful save if desired
        this.urls = [];
        // Clear the description textarea (you may need to use two-way binding [(ngModel)])
        // this.description = '';
      },
      (error) => {
        // Handle any errors that occurred during the save operation
        console.error('Error saving data:', error);
      }
    );
  }

}
