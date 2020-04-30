const mongoose = require('mongoose');
const convertError = require('../utils/convertErrors');
const Customer = require('../models/Customer');
const Account = require('../models/Account');

const tuData = require('../../tu-data1.json');
const connectDatabase = require('../models/connectDatabase');

const accountRatings = [{ id: 1, text: 'On Time' }];

const createAccountsResponse = ({ ok, accounts = [], errors = [] }) => ({
  ok,
  accounts: accounts.map((a) => ({
    creditorName: a.creditorName,
    balance: a.balance,
    limit: a.limit,
    availableCredit: a.limit - a.balance,
    accountRating: accountRatings.find((r) => r.id === a.accountRating).text,
    accountNumber: `${process.env.CREDIT_CARD_REPLACE_CHARACTER.repeat(
      a.accountNumber.length - 4
    )}${a.accountNumber.slice(-4)}`,
    paymentDate: a.paymentDate,
    status: a.status,
  })),
  errors,
});

const transformAccountJSON = ({ accounts, customer }) => {
  return accounts
    .filter((a) => a.account.type === 'CC' || a.account.type === 'CH')
    .map((a) => ({
      customerId: customer._id,
      creditorName: a.subscriber.name.unparsed,
      balance: a.currentBalance,
      limit: a.creditLimit,
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

const getAccounts = ({ code = null, customerId = null }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await connectDatabase();

      // TODO: check for accounts in db for this user/code
      let customer;
      if (code) {
        customer = await Customer.findOne({ code });
      } else if (customerId) {
        customer = await Customer.findOne({ customerId });
      }

      if (!customer)
        throw new Error(`${customerId !== null ? 'User' : 'Code'} not found`);

      let accounts;
      accounts = await Account.find({ customerId: customer._id });

      // if accounts not found then get information from TransUnion
      if (!accounts || accounts.length === 0) {
        const transUnionData = transformAccountJSON({
          accounts: tuData.tradeAccounts,
          customer,
        });
        accounts = await Account.create(transUnionData);
      }

      resolve(accounts);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  Query: {
    getAccountsForUser: async (parent, { userId }, context) => {
      try {
        const accounts = await getAccounts({ customerId: userId });

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
    getAccountsFromCode: async (parent, { code }, context) => {
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
  },
};
