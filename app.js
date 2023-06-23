

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog'); 
const moment = require('moment');

//express app
const app = express();

// mongo dB
const dBUser = 'mongodb+srv://netninja:netninja1234@cluster0.uaizqkx.mongodb.net/Node-tuts?retryWrites=true&w=majority';
mongoose.connect(dBUser, {useNewUrlParser: true, useUnifiedTopology: true})
//.then((result)=> console.log('connected to db'))
  .then((result)=> app.listen(3000))
  .catch((err)=> console.log(err));

// REGISTER VIEW ENGINE
app.set('view engine', 'ejs');

// LISTENING TO REQUESTS
// app.listen(3000);

// MIDDLEWEARS
app.use(express.static('public'));            // LINKING OUTSIDE FILES in the folder PUBLIC
app.use(express.urlencoded({extended: true}));  //to access req.body (The data after submitting)
app.use(morgan('dev'));
// app.use((req, res, next) => {
//     res.locals.path = req.path;
//     next();
//   });

// MONGOOSE AND MONGO SANDBOX ROUTES
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//       title: 'new blog 2',
//       snippet: 'about my new blog',
//       body: 'more about my new blog'
//     })

//     blog.save()
//     .then(result => {
//       res.send(result);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });

// app.get('/all-blogs', (req, res) => {
//     Blog.find()
//       .then(result => {
//         res.send(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   });
//   app.get('/single-blog', (req, res) => {
//     Blog.findById('6494928aec9fc0a8d4c9a0ee')
//       .then(result => {
//         res.send(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   });

app.get('/',(req,res)=>{
    // res.send('<p>Home Page</p>');
    // res.sendFile('/views/index.html', {root : __dirname});
    // HARD CODED BLOGS
    // const blogs = [
    //     {title:'You are a kind person', snippet: 'lorem ipsum dollar sit amet cons'},
    //     {title:'You are a good person', snippet: 'lorem ipsum dollar sit amet cons'},
    //     {title:'You are a nice person', snippet: 'lorem ipsum dollar sit amet cons'},
    // ];
    // res.render('index', {title: 'Home', blogs});
    res.redirect('/blogs');
});

app.get('/about',(req,res)=>{
    // res.send('<p>Home Page</p>');
    // res.sendFile('/views/about.html', {root : __dirname});
    res.render('about', {title: 'About'});
});

//____CREATING a blog 
app.get('/blogs/create',(req,res)=>{
    res.render('create', {title: 'Create Blog'});
});

//____GETTING all the blogs from DATAbase
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })      // SEARCHING IN THE DATABASE and sorting by date
      .then(result => {
        res.render('index', { blogs: result, title: 'All blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  });

//____POSTING a blog to the DATAbase
app.post('/blogs', (req, res) => {
    //  console.log(req.body);
    const blog = new Blog(req.body);   //takes the data  (remember the POST method used in the EJS file and the action attribute)

    blog.save()                        // save to database
      .then(result => {
        res.redirect('/blogs');
      })
      .catch(err => {
        console.log(err);
      });
});

//____GETTING a blog from the DATAbase via ID and OPENING IT in DETAILS.EJS
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;  //extracting ID
    Blog.findById(id)          // searching for that ID
      .then(result => {
        res.render('details', { blog: result, title: 'Blog Details' });
      })
      .catch(err => {
        console.log(err);
      });
  });

// //Redirect
// app.get('/about-rtk', (req,res)=>{
//     res.redirect('/about');
// })

//DELETE BLOGS AND REDIRECTING TO HOME PAGE 
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;               //extracting ID
    Blog.findByIdAndDelete(id)              // searching for that ID and deleting it
      .then(result => {
             //redirecting to home page through JSON
        req.method = 'GET'; 
         res.redirect('/blogs');
      })
      .catch(err => {
        console.log(err);
      });
  });

//error 404 page
app.use((req,res)=>{
    // res.sendFile('./views/404.html', {root: __dirname});
    // res.status(404).sendFile('./views/404.html', {root: __dirname});
    res.status(404).render('404', {title: 'NOT FOUND'});
})