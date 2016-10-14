var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/data');

// var db = mongoose.connection;
var Schema = mongoose.Schema;

// db.on('error', console.error);

// db.once('open', function() {
var urlsSchema = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: { type: Number, default: 0},
  createdAt: { type: Date, default: Date.now },
});

urlsSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

exports.Link = mongoose.model('Link', urlsSchema);

var usersSchema = new Schema({
  username: String,
  password: String,
  createdAt: {type: Date, default: Date.now },
});

usersSchema.pre('save', function(next, data) {
  console.log('this in presave', this);
  this.hashPassword().bind(this);
  next();
});

usersSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

usersSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    });
};

exports.User = mongoose.model('User', usersSchema);
// });