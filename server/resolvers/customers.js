const shortid = require('shortid');

const convertError = require('../utils/convertErrors');

const Customer = require('../models/Customer');

const connectDatabase = require('../models/connectDatabase');

const createCustomerResponse = ({ ok, customer = null, errors = null }) => ({
  ok,
  customer,
  errors,
});

module.exports = {
  Query: {
    getCustomerById: async (parent, { customerId }, context) => {
      try {
        await connectDatabase();

        // TODO: check for accounts in db for this user/code
        const customer = await Customer.findById(customerId);
        if (!customer)
          throw new Error('No customer found with the provided information.');

        return createCustomerResponse({
          ok: true,
          customer,
        });
      } catch (error) {
        return createCustomerResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
  },
  Mutation: {
    createCustomer: async (parent, { input }, context) => {
      try {
        const code = shortid.generate();

        await connectDatabase();

        const customer = await Customer.create({
          ...input,
          code,
        });

        return createCustomerResponse({
          ok: true,
          customer,
        });
      } catch (error) {
        return createCustomerResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
    updateCustomer: async (parent, { input }, context) => {
      try {
        const { customerId } = input;
        if (!customerId) throw new Error('No Customer found.');

        await connectDatabase();

        const customer = await Customer.findOneAndUpdate(
          { _id: customerId },
          input,
          {
            upsert: false,
          }
        );

        return createCustomerResponse({
          ok: true,
          customer,
        });
      } catch (error) {
        return createCustomerResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
  },
};
