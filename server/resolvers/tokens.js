const shortid = require('shortid');

const convertError = require('../utils/convertErrors');
const { generateToken } = require('../utils/tokens');
const Customer = require('../models/Customer');

const connectDatabase = require('../models/connectDatabase');

const createTokenResponse = ({ ok, token = null, errors = null }) => ({
  ok,
  token,
  errors,
});

module.exports = {
  Query: {
    getTokenByCodeAndPhoneNumber: async (
      parent,
      { code, phoneNumber },
      context
    ) => {
      try {
        await connectDatabase();

        // TODO: check for accounts in db for this user/code
        const customer = await Customer.findOne({ code, phoneNumber });
        if (!customer)
          throw new Error('No customer found with the provided information.');

        const token = await generateToken({
          user: {
            displayName: `${customer.firstName} ${customer.lastName}`,
            code: customer.code,
            id: customer.id,
          },
          type: 'Customer',
        });

        return createTokenResponse({
          ok: true,
          token,
        });
      } catch (error) {
        console.log('error', error);
        return createTokenResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
  },
};
