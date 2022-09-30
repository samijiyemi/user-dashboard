const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
     balance: {
          type: Number,
          default: 0
     },
     user_id: {
          ref: "users",
          type: mongoose.Types.ObjectId
     }
}, {
     timestamps: true
})

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;