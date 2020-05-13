const {
  getAccounts,
  performAccountMasking,
  createAccountsResponse,
} = require('../utils/accounts');
const {
  softVerifyCustomer,
  performAddressVerificationAndUpdateCustomer,
} = require('../utils/customer');

const { pick } = require('lodash');

const axios = require('axios').default;
const omit = require('lodash/omit');
const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');
const Customer = require('../models/Customer');
const Account = require('../models/Account');
const {
  addressFieldsChanged,
  tamuAddressFieldsFound,
} = require('../utils/customer');

const connectDatabase = require('../models/connectDatabase');

module.exports = {
  Query: {
    getAccountsForCustomer: async (parent, { customerId }, { isAdmin }) => {
      try {
        let accounts = await getAccounts({ customerId });

        accounts = performAccountMasking({ accounts, isAdmin });
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
    getAccountsFromCode: async (parent, { code }, { isAdmin }) => {
      try {
        let accounts = await getAccounts({ code });

        accounts = performAccountMasking({ accounts, isAdmin });

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
    getAccountInformationFromTransUnion: async (
      parent,
      { input },
      { isAdmin }
    ) => {
      try {
        await connectDatabase();

        // connecting to test transunion data
        let customer = await Customer.findById(input.customerId);

        if (!customer)
          throw new Error(ERRORS.CUSTOMER.NOT_FOUND_WITH_PROVIDED_INFO);

        const account = await Account.findOne({
          customerId: customer.id,
        });

        await softVerifyCustomer({ input, customer });
        const body = omit(input, ['customerId']);

        // do not allow user to search other ssn
        if (customer.ssn) {
          body.ssn = customer.ssn;
        }

        let accounts;

        if (
          account.tradeAccounts.length === 0 &&
          account.collectionAccounts.length === 0
        ) {
          // Check to see if we have TransUnion specific address fields, if not go get them and add them to the body
          // const addressVerification
          customer = await performAddressVerificationAndUpdateCustomer({
            customer,
            fields: body,
          });

          // pull pertinent data from customer object
          const tuRequestBody = pick(customer, [
            'ssn',
            'addressUnit',
            'lastName',
            'addressStreet',
            'zipCode',
            'addressPreDirection',
            'addressPostDirection',
            'state',
            'firstName',
            'city',
            'addressType',
            'addressNumber',
            'middleInit',
          ]);

          // call transunion to get account information for this user.
          const result = await axios.post(
            process.env.TU_API_PATH,
            tuRequestBody
          );

          accounts = await Account.findOneAndUpdate(
            { customerId: customer.id },
            { customerId: customer.id, ...result.data },
            { new: true, upsert: true }
          );
        } else {
          // do not call transunion if we already have data
          accounts = await Account.findOne({ customerId: customer.id });
          accounts = performAccountMasking({ accounts, isAdmin });
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
