// var usersSchema = require('../config').usersSchema;
// var mongoose = require('mongoose');
// var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');

// usersSchema.methods.initialize = function() {
//   this.on('init', this.hashPassword);
// };

// usersSchema.methods.comparePassword = function(attemptedPassword, callback) {
//   bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
//     callback(isMatch);
//   });
// };

// usersSchema.methods.hashPassword = function(model) {
//   var cipher = Promise.promisify(bcrypt.hash);
//   return cipher(this.password, null, null).bind(this)
//     .then(function(hash) {
//       this.password = hash;
//     });
// };

// exports = mongoose.model('User', usersSchema);