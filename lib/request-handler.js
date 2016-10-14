var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = db.User;
var Link = db.Link;
// var User = require('../app/models/user');
// var Link = require('../app/models/link');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().then(function(links) {
    console.log('links', links);
    res.status(200).send(links); //took out models
  });  

  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.find({ url: uri }).then(function(found) {
    if (found.length > 0) {
      res.status(200).send(found[0]); //took out .attr
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newLink.save().then(function(newLink) {
          res.status(200).send(newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username })
    .then(function(user) {
      if (user.length === 0) {
        res.redirect('/login');
      } else {
        console.log(user[0]);
        user[0].comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user[0]);
          } else {
            res.redirect('/login');
          }
        });
      }
    });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username })
    .then(function(user) {
      if (user.length === 0) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.hashPassword();
        newUser.save()
          .then(function(newUser) {
            util.createSession(req, res, newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  Link.find({ code: req.params[0] }).then(function(link) {
    if (link.length === 0) {
      res.redirect('/');
    } else {
      link.visits++;
      link[0].save()
        .then(function() {
          return res.redirect(link[0].url);
        });
    }
  });
};