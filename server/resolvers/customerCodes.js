const { generateCode } = require('../utils/customerCodes');

const moment = require('moment');

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
          const code = generateCode(Number(process.env.CODE_LENGTH || '6'));
          customerCode = await CustomerCode.create({
            customerId,
            code,
            expiry: moment()
              .utc()
              .add(Number(process.env.CODE_EXPIRY_IN_MINUTES), 'minutes'),
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

        const code = generateCode(Number(process.env.CODE_LENGTH || '6'));
        const customerCode = await CustomerCode.create({
          customerId: customer.id,
          code,
          expiry: moment()
            .utc()
            .add(Number(process.env.CODE_EXPIRY_IN_MINUTES), 'minutes'),
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
