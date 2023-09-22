import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoaderService } from './../../services/loader-service/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../common-service/common.service';


@Injectable({
  providedIn: 'root'
})
export class BlogService {
  finalBlogsUrl: any;
  private data = new BehaviorSubject(null);
  confirmationText = "Are you sure you want to delete";


  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router) {
    this.finalBlogsUrl = this.commonService.finalBlogsUrl;

  
 }

   /*----blogs---*/

   getBlogsList() {
    return this.http.get(this.finalBlogsUrl);
  }

  addBlogs(data) {
    return this.http.post(this.finalBlogsUrl, data);
  }

  deleteBlogs(id) {
    return this.http.delete(this.finalBlogsUrl + "/" + id);
  }

  updateBlogs(data) {
    return this.http.patch(this.finalBlogsUrl + '/' + data._id, data);
  }
  /*---end blogs---*/

}
