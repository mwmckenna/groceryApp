var express = require("express"),
bodyParser = require("body-parser"),
methodOverride = require('method-override'),
passport = require("passport"),
passportLocal = require("passport-local"),
cookieParser = require("cookie-parser"),
session = require("cookie-session"),
flash = require('connect-flash'),
app = express(),
db = require("./models/index.js");
var morgan = require('morgan');
var routeMiddleware = require("./config/routes");

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.use(session( {
  secret: '9870897456587',
  name: 'grocery key',
  // this is in milliseconds
  maxage: 3600000
  })
);

// get passport started
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// prepare our serialize functions
passport.serializeUser(function(user, done){
  console.log("SERIALIZED JUST RAN!");
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN!");
  db.User.find({
      where: {
        id: id
      }
    })
    .done(function(error,user){
      done(error, user);
    });
});

app.get('/', routeMiddleware.preventLoginSignup, function(req,res){
    res.render('home');
});

app.get('/signup', routeMiddleware.preventLoginSignup, function(req,res){
    res.render('users/signup', { username: ""});
});

app.get('/login', routeMiddleware.preventLoginSignup, function(req,res){
    res.render('users/login', {message: req.flash('loginMessage'), username: ""});
});

// app.get('lists/index', routeMiddleware.checkAuthentication, function(req,res){
//   res.render("lists/index", {user: req.user});
// });

// on submit, create a new users using form values and log them in if all goes well
app.post('/signup', function(req,res){

  db.User.createNewUser(req.body.username, req.body.password,
  function(err){
    res.render("users/signup", {message: err.message, username: req.body.username});
  },
  // This allows the user to be logged in right after creating an account!
  function(){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/lists')
    });
  });
});

// authenticate users when logging in - no need for req,res passport does this for us
app.post('/login', passport.authenticate('local', {
  successRedirect: '/lists',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/logout', function(req,res){
  //req.logout added by passport - delete the user id/session
  req.logout();
  res.redirect('/');
});



// app.get("/", function (req, res) {
//   res.render("lists/new.ejs");
// });

app.get("/lists/new", function (req, res) {
  res.render("lists/new", {user: req.user});
});

app.get("/lists", function (req, res) {
  db.User.find(req.user.id).done(function(err,user){
    user.getLists().done(function(err,lists){
      res.render("lists/index", {lists: lists, user:req.user});  
    })
  })
});

app.get("/list/:id/items", function (req, res) {
  db.List.find({
    where: {
      id: req.params.id
    }
  }).done(function (err, list) {
    list.getItems().done(function(err,items){
      res.render("lists/show", {items:items, list: list});  
    })
    
  });
});

app.post("/lists", function (req, res) {
  var userParams = req.body.user;
  var listParams = req.body.list;
  var itemParams = req.body.item;
  var tagParams = req.body.tags;

  // console.log(req.body.item);
  // var item = {};
  // var count = 0;
  // item.id = count;
  // //item.name = req.body.item.name;
  // //item.brand = req.body.item.brand;
  // items.push(itemParams);
  // count++;
  // res.redirect('/lists/index');
  
  var itemArr = [];
  var createItems = function (list) {
     if (itemArr.length === 0) {
      res.redirect("/lists/new");
    } else {
      var itemObj = {name: itemArr.pop()};
      
      db.Item.findOrCreate({
        where: {
          ListId: 1
        },
        defaults: {

        } 
      }).then(function (err, item, created) {
        list.addItem(item);
        createItems(list);
      });
    }
  };

  var tagArr = tagParams.split(",");

  var createTags = function (item) {
    if (tagArr.length === 0) {
      res.redirect("/lists/new");
    } else {
      var tagObj = {name: tagArr.pop()};
      db.Tag.findOrCreate({
        where: tagObj,
        defaults: tagObj
      }).then(function (err, tag, created) {
        item.addTag(tag);
        createTags(item);
      });
    }
  };

  var createList = function(err, user, created) {
    db.List.create(listParams).done(function(err, list) {
      user.addlist(list).then(function () {
        createItems(list);
      });
    });
  };

  db.User.findOrCreate({
    where: userParams,
    defaults: userParams
  }).then(createList);
});

// this is what happens when you submit the items/new.ejs form
app.post('/createList', function(req,res){
  db.List.create({
    name: req.body.name,
    UserId: req.body.UserId
  }).done(function(err,list){
    res.render('items/new',{list:list});
  })
});

app.post('/addItems', function(req,res){
  db.Item.create({
    name: req.body.name,
    brand: req.body.brand,
    price: req.body.price,
    ListId: req.body.ListId
  }).done(function(err, item){
    item.getList().done(function(err,list){
      res.render('items/new', {list:list})  
    })
  })
})

app.get("/users/:id", function (req, res) {
  var id = req.params.id;
  db.User.find(id).then(function (err, user) {
    user.getLists().then(function (err, lists) {
      res.render("users/show.ejs", {
        user: user,
        lists: lists
      });
    });
  });
});

app.get("/tags/:name", function (req, res) {
  var tagName = req.params.name;
  db.Tag.find({where: {name: tagName}}).then(function (err, tag) {
    tag.getItems({include: [db.List]}).then(function (err, items) {
      res.render("tags/show.ejs", {tag:tag, items:items});
    });
  });
});

// var delItems = function () {
//   $('#ok').click(function() {
//     $(".listItem").remove();
//   });
// };

// delItems();


// var initialize = function() {

//   var delItems = function () {
//     $('#ok')
//       .on('click', function() {
//         $('.listItem #ok').remove();
//       })
//     });

//   delItems();

//   // $("#reset").bind("click", function() {
//   //   $("li").removeClass("selected");
//   //   $("img").attr("src","./images/panic.jpeg");
//   // });

//   console.log("delItems done");
// };

// // window.onload=initialize;
// $(window).load(initialize);


// catch-all for 404 errors
app.get('*', function(req,res){
  res.status(404);
  res.render('users/404');
});

app.listen(3000);