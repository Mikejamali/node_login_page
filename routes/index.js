const express = require("express");
const router = express.Router();
let user = { username: "mike", password: "mikepass"};


function authenticate(req, res, next) {
  if (req.session.token) {
    res.redirect("/results");
  } else {
    // console.log("No token");
    next();
  }
}

router.get("/", authenticate, function(req, res) {
  console.log("hello");
  res.render("login");
});

router.post("/", function(req, res) {
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

    // console.log(messages);

    let data = {
      errors: messages,
      username: req.body.username,
      password: req.body.Password,
    };

    res.render('results', data);
  });
});


router.get("/results", function(req, res, next) {
  if (req.session.token) {
    next();
  } else {
    res.redirect("/")
  }
}, function(req, res) {
  res.render("results", req.session.user);
});


router.post("/results", function(req, res) {
  let obj = {
    username: req.body.username,
    password: req.body.password
  };

  if (obj.username == user.username && obj.password == user.password) {
    req.session.user = obj;
    req.session.token = "afs29628";
    res.redirect("/results");
  } else {
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
