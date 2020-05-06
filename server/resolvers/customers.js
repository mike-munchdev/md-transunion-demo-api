const shortid = require('shortid');
const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');

const Customer = require('../models/Customer');
const Account = require('../models/Account');
const CustomerCode = require('../models/CustomerCode');

const connectDatabase = require('../models/connectDatabase');

const createCustomerResponse = ({ ok, customer = null, errors = null }) => ({
  ok,
  customer,
  errors,
});

const maskSensitiveCustomerData = (c) => {
  return {
    ...c.toObject(),
    id: c.id,
    ssn: `${process.env.CREDIT_CARD_REPLACE_CHARACTER.repeat(5)}${c.ssn.slice(
      -4
    )}`,
  };
};

module.exports = {
  Query: {
    getCustomerById: async (parent, { customerId }, { isAdmin }) => {
      try {
        await connectDatabase();

        // TODO: check for accounts in db for this user/code
        let customer = await Customer.findById(customerId);

        const accountCount = await Account.countDocuments({
          customerId: customerId,
        });

        if (!customer)
          throw new Error('No customer found with the provided information.');
        cust;
        if (!isAdmin) {
          customer = maskSensitiveCustomerData(customer);
        }
        customer.accountCount = accountCount;

        return createCustomerResponse({
          ok: true,
          customer,
        });
      } catch (error) {
        console.log('error', error);
        return createCustomerResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
  },
  Mutation: {
    createCustomer: async (parent, { input }, { isAdmin }) => {
      try {
        const code = shortid.generate();

        await connectDatabase();

        let customer = await Customer.create({
          ...input,
        });

        const customerCode = await CustomerCode.create({
          customerId: customer.id,
          code,
        });

        if (!isAdmin) {
          customer = maskSensitiveCustomerData(customer);
        } else {
          customer.id = customer._id;
        }

        const response = createCustomerResponse({
          ok: true,
          customer: {
            ...customer,
            code: customerCode.code,
          },
        });

        return response;
      } catch (error) {
        return createCustomerResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
    updateCustomer: async (parent, { input }, { isAdmin }) => {
      try {
        const { customerId } = input;
        if (!customerId) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);

        await connectDatabase();

        let customer = await Customer.findOneAndUpdate(
          { _id: customerId },
          input,
          {
            upsert: false,
          }
        );

        if (!isAdmin) {
          customer = maskSensitiveCustomerData(customer);
        }

        return createCustomerResponse({
          ok: true,
          customer,
        });
      } catch (error) {
        console.log('error', error);
        return createCustomerResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
  },
};
