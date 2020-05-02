const mongoose = require('mongoose');
const axios = require('axios').default;
const convertError = require('../utils/convertErrors');
const Customer = require('../models/Customer');
const Account = require('../models/Account');

const tuData = require('../../tu-data1.json');
const connectDatabase = require('../models/connectDatabase');

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

const createAccountsResponse = ({
  ok,
  validAccounts = [],
  invalidAccounts = [],
  errors = [],
}) => ({
  ok,
  validAccounts: validAccounts.map(transformAccountJSON),
  invalidAccounts: invalidAccounts.map(transformAccountJSON),
  errors,
});

const transformTransUnionJSON = ({ accounts, customer }) => {
  return accounts
    .filter((a) => a.account.type === 'CC' || a.account.type === 'CH')
    .map((a) => ({
      customerId: customer._id,
      creditorName: a.subscriber.name.unparsed,
      balance: a.currentBalance,
      limit: a.creditLimit || 0,
      availableCredit: a.creditLimit - a.currentBalance,
      accountRating: a.accountRating,
      accountNumber: a.accountNumber.toString(),
      paymentDate: a.mostRecentPayment ? a.mostRecentPayment.date : null,
      status:
        a.currentBalance >= Number(process.env.MINIMUM_ACCOUNT_BALANCE)
          ? 'GOOD'
          : 'NOT GOOD',
    }));
};

const getCustomerTransUnionData = async (ssn) => {
  return new Promise((resolve, reject) => {
    try {
      const customerData = tuData.find(
        (d) => d.indicative.socialSecurity.number.toString() === ssn
      );
      if (customerData)
        resolve({
          tradeAccounts: customerData.tradeAccounts,
          collectionAccounts: customerData.collectionAccounts,
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
      accounts = await Account.find({ customerId: customer._id });

      // if accounts not found then get information from TransUnion
      if (!accounts || accounts.length === 0) {
        const userAccountsFromTransUnion = await getCustomerTransUnionData(
          customer.ssn
        );

        if (userAccountsFromTransUnion) {
          const transUnionData = transformTransUnionJSON({
            accounts: [
              ...userAccountsFromTransUnion.tradeAccounts,
              ...userAccountsFromTransUnion.collectionAccounts,
            ],
            customer,
          });

          await Account.create(transUnionData);

          accounts = await Account.find({ customerId: customer._id });
        }
      }

      resolve(accounts);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  Query: {
    getAccountsForCustomer: async (parent, { customerId }, context) => {
      try {
        const accounts = await getAccounts({ customerId });

        return createAccountsResponse({
          ok: true,
          validAccounts: accounts.filter((a) => a.status === 'GOOD'),
          invalidAccounts: accounts.filter((a) => a.status === 'NOT GOOD'),
        });
      } catch (error) {
        return createAccountsResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
    getAccountsFromCode: async (parent, { code }, context) => {
      try {
        const accounts = await getAccounts({ code });

        return createAccountsResponse({
          ok: true,
          validAccounts: accounts.filter((a) => a.status === 'GOOD'),
          invalidAccounts: accounts.filter((a) => a.status === 'NOT GOOD'),
        });
      } catch (error) {
        return createAccountsResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
    getAccountInformationFromTransUnion: async (parent, { input }, context) => {
      try {
        await connectDatabase();

        // connecting to test transunion data
        // const customer = await Customer.findById(input.customerId);

        // const result = await axios.get(process.env.TU_API_PATH, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Accept: 'application/json',
        //   },
        // });

        // // console.log('result', result.data);
        // const transUnionData = transformTransUnionJSON({
        //   accounts: [
        //     ...result.data.tradeAccounts,
        //     ...result.data.collectionAccounts,
        //   ],
        //   customer,
        // });

        // await Account.create(transUnionData);

        const accounts = await Account.find({ customerId: input.customerId });

        return createAccountsResponse({
          ok: true,
          validAccounts: accounts.filter((a) => a.status === 'GOOD'),
          invalidAccounts: accounts.filter((a) => a.status === 'NOT GOOD'),
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
