const express = require("express");
const router = express.Router();
let user = { username: "mike", password: "mikepass"};
let data;

// function authenticate(req, res, next) {
//   if (req.session.token) {
//     res.redirect("/");
//   } else {
//     console.log("No token");
//     next();
//   }
// }

router.get("/", function(req, res, next) {
  if (req.session.token) {
    res.render("results", data)
  }
  else {
  // console.log("hello");
  res.redirect("/login");
 }
},
 function(req, res) {
  res.render("home", {user: req.session.username});
});

router.get("/login", function(req, res){
  console.log(data);
  res.render("login", data)
});


router.post("/login", function(req, res, next) {
  console.log("checking request" + req);


  req.checkBody("username", "username cannot contain any special characters.").isAlphanumeric();
  req.checkBody("username", "username cannot be empty.").notEmpty({min: 8});
  req.checkBody("username", "Must be a username.").isLength({max: 25});
  req.checkBody("password", "password is too short").isLength({min: 8});

  let errors = req.getValidationResult();
  let messages = [];

  errors.then(function(result){
    result.array().forEach(function(error){
      messages.push(error.msg);
    });

    if (messages.length > 0) {
      res.redirect("/login");
    }
    else
      data = {
        username: req.body.username,
        password: req.body.password,
   };
    if (req.body.username === user.username && req.body.password === user.password) {
      req.session.token = "afs29628";
       data = {
        username: req.body.username,
        password: req.body.password,
      };

      res.redirect('/');
    }
    else {
      data = {
       errors: messages
     };
      res.redirect("/login")
    };



  });
});


router.get("/home", function(req, res, next) {
  if (req.session.token) {
    next();
  } else {
    res.redirect("/")
  }
}, function(req, res) {
    res.render("home", req.session.user);
});


router.post("/home", function(req, res) {
  let obj = {
    username: req.body.username,
    password: req.body.password
  };

  if (obj.errors.length == 0) {
    req.session.user = obj;
    req.session.token = "afs29628";
    res.redirect("/");
  } else { ////look at else
    res.redirect("/");
  }
});

router.get("/logout", function(req, res) {
  req.session.destroy(function(err) {
    console.log(err);
  });

  res.redirect("/");
});


module.exports = router;
