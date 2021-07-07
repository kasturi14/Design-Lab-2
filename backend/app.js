const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Post = require('./models/post');
const User = require('./models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const checkAuth = require('./middleware/check-auth');

mongoose.connect(APP_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(()=>{
    console.log('Database connected!');
}).catch((error)=> {
    console.log('Database Connection failed: ', error);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//cors error solved->
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");//no matter which domain the app is running, it is allowed to access our resources.
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization"); //means the incoming request may have these errors   
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
    next();
});


app.get('/api/posts', (req,res,next)=>{
    Post.find().then(documents=>{
        // console.log(documents);
        res.status(200).json({
            message:'posts fetched successfully',
            posts: documents
        });
    });
});

app.post("/api/posts",checkAuth,(req,res,next) => {
    const post = new Post({
        name: req.body.name,
        desc:req.body.desc,
        imageUrl:req.body.imageUrl
    });
    post.save().then(createdPost => {
        console.log(createdPost);    
        res.status(201).json({
            message:'post added sucessfully from server!',
            postid: createdPost._id
        });
    });
});

app.put('/api/posts/:id',checkAuth, (req,res, next)=>{
    const newpost = new Post({
        _id: req.body.id,
        name: req.body.name,
        desc:req.body.desc,
        imageUrl:req.body.imageUrl
    });
    Post.updateOne({_id:req.params.id}, newpost).then(result=>{
        console.log('updated from database!');
        res.status(200).json({message: "Post updated"});
    });;
});


app.delete("/api/posts/:id",checkAuth, (req,res,next)=>{
    Post.deleteOne({_id:req.params.id}).then(result=>{
        console.log('deleted from database!');
        res.status(200).json({message: "Post deleted"});
    });
})


//user route
app.post("/api/user/login",(req,res,next)=>{
    let fetchedUser;
    User.findOne({username: req.body.username})
    .then(user => {
        if(!user) {
            return res.status(401).json({
                message:'Auth faileddd'
            });
        }
        fetchedUser=user;
        return req.body.password === user.password;
    })
    .then(result => {
        if(!result) {
            return res.status(401).json({
                message:'Auth faileddd'
            });
        }
        //json web token
        const token=jwt.sign(
            {
                username:fetchedUser.username, 
                userid: fetchedUser._id
            }, 
            APP_KEY
        );//creates a new token
        
        res.status(200).json({
            token:token
        });

    }).catch(err=>{
        return res.status(401).json({
            message:'Auth faileddd'
        });
    });
});

module.exports = app;