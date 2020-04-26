const tuData = require('../../tu-data1.json');
const accountRatings = [{ id: 1, text: 'On Time' }];
const transformAccountJSON = (accounts) => {
  return accounts
    .filter((a) => a.account.type === 'CC' || a.account.type === 'CH')
    .map((a) => ({
      creditorName: a.subscriber.name.unparsed,
      balance: a.currentBalance,
      limit: a.creditLimit,
      availableCredit: a.creditLimit - a.currentBalance,
      rating: accountRatings.find((r) => r.id === a.accountRating).text,
      acctNumber: `${process.env.CREDIT_CARD_REPLACE_CHARACTER.repeat(
        a.accountNumber.toString().length - 4
      )}${a.accountNumber.toString().slice(-4)}`,
      paymentDate: a.mostRecentPayment ? a.mostRecentPayment.date : null,
      status:
        a.currentBalance >= Number(process.env.MINIMUM_ACCOUNT_BALANCE)
          ? 'good'
          : 'not',
    }));
};

module.exports = {
  Query: {
    getAccountsForUser: async (parent, { id }, context) => {
      console.log('tuData.tradeAccounts', tuData.tradeAccounts.length);
      return {
        ok: true,
        accounts: transformAccountJSON(tuData.tradeAccounts),
        errors: null,
      };
    },
  },
};
