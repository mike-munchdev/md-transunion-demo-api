const { encrypt } = require('../utils/encryption');

const mongoose = require('mongoose');
const { default: validatorF } = require('validator');

const CustomerSchema = new mongoose.Schema({
  code: { type: String, required: true },
  email: {
    type: String,
    validate: {
      validator: (v) => validatorF.isEmail(v),
      message: 'Email validation failed',
    },
  },
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
  ssn: { type: String, required: false },
  phoneNumber: { type: String, required: true },
  suffix: { type: String, required: false },
  addresses: [
    {
      status: { type: String, required: true },
      qualifier: { type: String, required: true },
      street: {
        number: { type: Number, required: true },
        name: { type: String, required: true },
        preDirectional: { type: String, required: true },
        type: { type: String, required: true },
        unit: {
          number: { type: Number, required: true },
        },
      },
      location: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: Number, required: true },
      },
      dateReported: { type: Date, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CustomerSchema.pre('save', async function () {
  const customer = this;
  if (customer.isModified('ssn')) {
    // console.log('customer: ssn changed', customer);
  }
});

module.exports = mongoose.model('Customer', CustomerSchema);
