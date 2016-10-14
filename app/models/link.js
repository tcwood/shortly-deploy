// var urlsSchema = require('../config').urlsSchema;
// var mongoose = require('mongoose');
// var bcrypt = require('bcrypt-nodejs');

// urlsSchema.methods.initialize = function() {
//   this.on('init', function(model) {
//     var shasum = crypto.createHash('sha1');
//     shasum.update(model.url);
//     model.code = shasum.digest('hex').slice(0, 5);
//   });
// };

// exports = mongoose.model('Link', urlsSchema);