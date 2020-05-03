const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  creditorName: { type: String, required: true },
  balance: { type: Number, required: true },
  limit: { type: Number, required: true },
  accountRating: { type: String, required: true },
  accountNumber: { type: String, required: true },
  paymentDate: { type: Date, required: false },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// TODO: encrypt credit card number in database;
AccountSchema.pre('save', async function () {
  const account = this;
  if (account.isModified('accountNumber')) {
  }
});
module.exports = mongoose.model('Account', AccountSchema);
