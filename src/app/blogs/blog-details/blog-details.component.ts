import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/services/blog/blog.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {

  blogId: string = '';
  blogSlug: string = '';
  blog: any = {}

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.blogId = params.get('blogId')!;
      this.blogSlug = params.get('blogSlug')!;
      if (this.blogId) {
        this.getBlogDetail(this.blogId);
      }
    });
  }

  getBlogDetail(blogId: string): void {
    this.blogService.getBlogDetail(blogId).subscribe((blog) => {
      console.log("blog===", blog);
      this.blog = blog;
    })
  }
}
