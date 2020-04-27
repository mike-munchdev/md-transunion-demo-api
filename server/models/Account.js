const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  clientId: mongoose.Schema.Types.ObjectId,
  creditorName: { type: String, required: true },
  balance: { type: Number, required: true },
  limit: { type: Number, required: true },
  accountRating: { type: Number, required: true },
  accountNumber: { type: String, required: true },
  paymentDate: { type: Date, required: false },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// TODO: encrypt credit card number in database;

module.exports = mongoose.model('Account', AccountSchema);
