const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-currency').loadType(mongoose)
const passportLocalMongoose = require('passport-local-mongoose')

let userSchema = new Schema({
  admin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

userSchema.plugin(passportLocalMongoose)

let User = mongoose.model('User', userSchema)

module.exports = User
