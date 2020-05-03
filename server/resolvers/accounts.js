const axios = require('axios').default;
const convertError = require('../utils/convertErrors');
const Customer = require('../models/Customer');
const Account = require('../models/Account');

const { accountRatings } = require('../utils/lookup');
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
      accounts = await Account.find({ customerId: customer._id });

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
    getAccountsFromCode: async (parent, { code }) => {
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
    getAccountInformationFromTransUnion: async (parent, { input }) => {
      try {
        await connectDatabase();

        // connecting to test transunion data
        const customer = await Customer.findById(input.customerId);

        const result = await axios.get(process.env.TU_API_PATH, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        const filteredResults = await getCustomerTransUnionData({
          data: result.data,
          filters: input,
        });

        const transUnionData = transformTransUnionJSON({
          accounts: [
            ...filteredResults.tradeAccounts,
            ...filteredResults.collectionAccounts,
          ],
          customer,
        });

        await Account.create(transUnionData);

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
