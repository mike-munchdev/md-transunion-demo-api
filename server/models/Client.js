const mongoose = require('mongoose');
const { default: validatorF } = require('validator');

const ClientSchema = new mongoose.Schema({
  code: { type: String, required: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: (v) => validatorF.isEmail(v),
      message: 'Email validation failed',
    },
  },
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
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

module.exports = mongoose.model('Client', ClientSchema);
