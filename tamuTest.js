const { pick } = require('lodash');

const axios = require('axios').default;
const Customer = require('./server/models/Customer');
const connectDatabase = require('./server/models/connectDatabase');
const { ERRORS } = require('./server/constants/errors');

const addressFieldsChanged = ({ customer, fields }) =>
  customer.address !== fields.address ||
  customer.address2 !== fields.address2 ||
  customer.city !== fields.city ||
  customer.state !== fields.state ||
  customer.zipCode !== fields.zipCode;

const tamuAddressFieldsFound = (customer) =>
  customer.addressStreet !== null ||
  customer.addressPreDirection !== null ||
  customer.addressPostDirection !== null ||
  customer.addressType !== null ||
  customer.addressNumber !== null ||
  customer.addressUnit !== null ||
  customer.addressUnitType !== null;

(async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await connectDatabase();

      const body = {
        customerId: '5eb21a01e2e471cb136ffe26',
        ssn: '123456789',
        email: 'test@test.com',
        firstName: 'Miguel',
        middleInit: 'J',
        lastName: 'Griffith',
        suffix: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        // address: '3620 South Vermont Ave',
        // address2: 'Room 445',
        // city: 'Los Angeles',
        // state: 'California',
        // zipCode: '900890255',
      };
      let customer = await Customer.findById(body.customerId);

      // brand new customer
      if (!customer) {
        customer = await Customer.findOneAndUpdate(
          { _id: body.customerId },
          body,
          {
            upsert: false,
            new: true,
          }
        );
      }

      
  });
})();
