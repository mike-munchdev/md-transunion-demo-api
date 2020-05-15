const moment = require('moment');
const { ERRORS } = require('../constants/errors');

const { addressFieldsChanged, tamuAddressFieldsFound } = require('./customer');
const CustomerCode = require('../models/CustomerCode');
const Account = require('../models/Account');

const Customer = require('../models/Customer');

const connectDatabase = require('../models/connectDatabase');

module.exports.maskSensitiveAccountData = (a) => {
  return {
    ...a.toObject(),
    id: a.id,
    accountNumber: `${process.env.CREDIT_CARD_REPLACE_CHARACTER.repeat(
      12
    )}${a.accountNumber.slice(-4)}`,
  };
};

module.exports.createAccountsResponse = ({
  ok,
  accounts = null,
  errors = [],
}) => ({
  ok,
  accounts,
  errors,
});

module.exports.getAccounts = ({ code = null, customerId = null }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await connectDatabase();

      // TODO: check for accounts in db for this user/code
      let customer;
      if (code) {
        const customerCode = await CustomerCode.findOne({ code });
        if (!customerCode) throw new Error(ERRORS.CODE.NOT_VALID_OR_NOT_FOUND);
        const expiry = moment(customerCode.expiry).utc();

        const now = moment().utc();

        if (expiry.isBefore(now)) throw new Error(ERRORS.CODE.EXPIRED);

        customer = await Customer.findById(customerCode.customerId);
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

module.exports.performAccountMasking = ({ accounts, isAdmin }) => {
  if (!isAdmin) {
    const tradeAccounts = accounts.tradeAccounts.map(
      this.maskSensitiveAccountData
    );

    accounts.tradeAccounts = tradeAccounts;

    const collectionAccounts = accounts.collectionAccounts.map(
      this.maskSensitiveAccountData
    );

    accounts.collectionAccounts = collectionAccounts;
  }

  return accounts;
};
