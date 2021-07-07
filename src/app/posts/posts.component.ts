import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from '../model/post';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub!: Subscription;
  private authStatusSubs!: Subscription;
  userIsAuthenticated=false;  

  constructor(public postsService: PostsService, public authService:AuthService) {}

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[])=>{this.posts=posts;});

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs= this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated=isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete(postid: string) {
    this.postsService.deletePost(postid);
    this.authStatusSubs.unsubscribe();
  }
}
