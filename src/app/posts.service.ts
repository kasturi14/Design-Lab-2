import { Post } from './model/post';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({providedIn:'root'})

export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();
    
    constructor(private http: HttpClient){}

    getPosts() {
        //no need to unsubscribe as http is angular's built in. so automatically unsubscribes.
        this.http
        .get<{message:string, posts: any}>('http://localhost:3000/api/posts')
        .pipe(map((postData)=>{
            return postData.posts.map((post: { name: string; desc: string; imageUrl: string; _id: string; }) => {
                return {
                    name:post.name,
                    desc:post.desc,
                    imageUrl:post.imageUrl,
                    id: post._id
                };
            });
        }))
        .subscribe((tranformedPosts)=>{
            this.posts = tranformedPosts;
            this.postsUpdated.next([...this.posts]);
        }); 
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(name: string, desc: string, imageUrl: string) {
        const post: Post = {id: '', name: name, desc: desc, imageUrl: imageUrl};
        this.http.post<{message:string, postid:string}>('http://localhost:3000/api/posts', post)
        .subscribe((responseData)=>{
            console.log(responseData.message);  
            const id = responseData.postid;
            post.id=id;  
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
        });
    }

    deletePost(postid: string) {
        this.http.delete("http://localhost:3000/api/posts/"+postid)
        .subscribe(()=>{
            console.log('post deleted!');
            this.posts = this.posts.filter(post=> post.id!= postid);
            this.postsUpdated.next([...this.posts]);
        });
    }

    getAPost(id:string) {
        return {...this.posts.find(p => p.id === id)};
    }

    updatePost(id: string, name: string, desc: string, imageUrl: string) {
        const post: Post = {id: id, name: name, desc: desc, imageUrl: imageUrl};
        this.http.put('http://localhost:3000/api/posts'+id, post)
        .subscribe((responseData)=>{
            console.log(responseData);
        });
    }
}