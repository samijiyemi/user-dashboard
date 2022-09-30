const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true
     },
     email: {
          type: String,
          requied: true,
     },
     password: {
          type: String,
          required: true
     },
     seller: {
          type: Boolean,
          default: false
     }
}, {
     timestamps: true
})


userSchema.methods.toJSON = function () {
     var user = this
     var userObj = user.toObject()

     delete userObj.password
     return userObj
}

const User = mongoose.model('User', userSchema);

module.exports = User;


