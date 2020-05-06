const moment = require('moment');
const shortid = require('shortid');
const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');

const Customer = require('../models/Customer');
const CustomerCode = require('../models/CustomerCode');

const connectDatabase = require('../models/connectDatabase');

const createCustomerCodeResponse = ({
  ok,
  customerCode = null,
  errors = null,
}) => ({
  ok,
  customerCode,
  errors,
});

module.exports = {
  Query: {
    getCustomerCodeByCustomerId: async (parent, { customerId }, context) => {
      try {
        await connectDatabase();

        // check for customer
        const customer = await Customer.findById(customerId);

        if (!customer) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);

        // check for existing valid code
        let customerCode = await CustomerCode.findOne({
          customerId,
          expiry: { $gte: moment().utc().toDate() },
        });

        // invalid or no code and valid customer?  create new code
        if (!customerCode) {
          const code = shortid.generate();
          customerCode = await CustomerCode.create({
            customerId,
            code,
          });
        }

        return createCustomerCodeResponse({
          ok: true,
          customerCode,
        });
      } catch (error) {
        return createCustomerCodeResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
  },
  Mutation: {
    createCustomerCodeForCustomer: async (parent, { input }, context) => {
      try {
        await connectDatabase();

        const customer = await Customer.findById(input.customerId);

        if (!customer) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);

        const code = shortid.generate();
        const customerCode = await CustomerCode.create({
          customerId: customer.id,
          code,
        });

        return createCustomerCodeResponse({
          ok: true,
          customerCode,
        });
      } catch (error) {
        return createCustomerCodeResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
  },
};
