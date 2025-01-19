import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../common-service/common.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BlogService {
  finalBlogsUrl: any;
  confirmationText = "Are you sure you want to delete";


  constructor(
    private http: HttpClient,
    private commonService: CommonService,
  ) {
    this.finalBlogsUrl = this.commonService.finalBlogsUrl;
  }

   /*----blogs---*/

   getBlogsList() {
    return this.http
    .get(this.finalBlogsUrl)
    .pipe(
      map((response: Array<any>) => {
        return response?.map((item) => {
          var div = document.createElement('div');
          div.innerHTML = item.content;
          var firstImage = div.getElementsByTagName('img')[0]
          item.image = firstImage ? firstImage.getAttribute("src") : "./../../assets/images/images/download.jfif";
          return item
        });
      }),
    )
  }

  addBlogs(data) {
    return this.http.post(this.finalBlogsUrl, data);
  }

  deleteBlogs(id) {
    return this.http.delete(this.finalBlogsUrl + "/" + id);
  }

  updateBlogs(blogId, data) {
    return this.http.patch(this.finalBlogsUrl + '/' + blogId, data);
  }

  getBlogDetail(blogId) {
    return this.http.get(this.finalBlogsUrl + '/' + blogId)
    .pipe(
      map((blog: any) => {
        var div = document.createElement('div');
        div.innerHTML = blog.content;
        var firstImage = div.getElementsByTagName('img')[0]
        blog.image = firstImage ? firstImage.getAttribute("src") : "./../../assets/images/images/download.jfif";
        return blog
      })
    );
  }

  /*---end blogs---*/

}
