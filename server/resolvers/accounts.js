const axios = require('axios').default;
const omit = require('lodash/omit');
const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');
const Customer = require('../models/Customer');
const Account = require('../models/Account');

const { accountRatings } = require('../utils/lookup');
const connectDatabase = require('../models/connectDatabase');

const softVerifyCustomer = ({ input, customer }) => {
  return new Promise((resolve, reject) => {
    try {
      const customerVerified =
        input.firstName.toUpperCase() === customer.firstName.toUpperCase() &&
        input.lastName.toUpperCase() === customer.lastName.toUpperCase();
      if (!customerVerified)
        throw new Error(ERRORS.CUSTOMER.NOT_FOUND_WITH_PROVIDED_INFO);

      resolve(customerVerified);
    } catch (error) {
      reject(error);
    }
  });
};
const transformAccountJSON = (a) => {
  return {
    id: a.id,
    creditorName: a.creditorName,
    balance: a.balance,
    limit: a.limit,
    availableCredit: a.limit - a.balance,
    accountRating: accountRatings.find(
      (r) => r.code == a.accountRating.padStart(2, '0')
    ).description,
    accountNumber: `${process.env.CREDIT_CARD_REPLACE_CHARACTER.repeat(
      12
    )}${a.accountNumber.slice(-4)}`,
    paymentDate: a.paymentDate,
    status: a.status,
  };
};

const createAccountsResponse = ({ ok, accounts = null, errors = [] }) => ({
  ok,
  accounts,
  errors,
});

// TODO: change to work with transunion pull
const getCustomerTransUnionData = async ({ data, filters }) => {
  return new Promise((resolve, reject) => {
    try {
      const customerMatch =
        data.indicative.name.person.first === filters.firstName.toUpperCase() &&
        data.indicative.name.person.last === filters.lastName.toUpperCase() &&
        data.indicative.socialSecurity.number.toString() === filters.ssn;

      if (customerMatch)
        resolve({
          tradeAccounts: data.tradeAccounts,
          collectionAccounts: data.collectionAccounts,
        });

      throw new Error('No TransUnion data found!');
    } catch (error) {
      reject(error);
    }
  });
};

const getAccounts = ({ code = null, customerId = null }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await connectDatabase();

      // TODO: check for accounts in db for this user/code
      let customer;
      if (code) {
        customer = await Customer.findOne({ code });
      } else if (customerId) {
        customer = await Customer.findById(customerId);
      }

      if (!customer)
        throw new Error(
          `${customerId !== null ? 'Customer' : 'Code'} not found`
        );

      let accounts;
      accounts = await Account.findOne({ customerId: customer._id });

      resolve(accounts);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  Query: {
    getAccountsForCustomer: async (parent, { customerId }) => {
      try {
        const accounts = await getAccounts({ customerId });

        return createAccountsResponse({
          ok: true,
          accounts,
        });
      } catch (error) {
        return createAccountsResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
    getAccountsFromCode: async (parent, { code }) => {
      try {
        const accounts = await getAccounts({ code });

        return createAccountsResponse({
          ok: true,
          accounts,
        });
      } catch (error) {
        return createAccountsResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
    getAccountInformationFromTransUnion: async (parent, { input }) => {
      try {
        await connectDatabase();

        // connecting to test transunion data
        const customer = await Customer.findById(input.customerId);

        if (!customer)
          throw new Error(ERRORS.CUSTOMER.NOT_FOUND_WITH_PROVIDED_INFO);

        const accountCount = await Account.countDocuments({
          customerId: customer.id,
        });

        await softVerifyCustomer({ input, customer });
        const body = omit(input, ['customerId']);
        let accounts;

        if (accountCount === 0) {
          // call transunion if we don't have data for this user.
          const result = await axios.post(process.env.TU_API_PATH, body);
          accounts = await Account.findOneAndUpdate(
            { customerId: customer.id },
            { customerId: customer.id, ...result.data },
            { new: true, upsert: true }
          );
        } else {
          // do not call transunion if we already have data
          accounts = await Account.findOne({ customerId: customer.id });
        }

        return createAccountsResponse({
          ok: true,
          accounts,
        });
      } catch (error) {
        console.log('error', error);
        return createAccountsResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
  },
};
