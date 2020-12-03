const mongoose = require('mongoose');

module.exports.addressSchema = new mongoose.Schema({
  status: { type: String },
  qualifier: { type: String },
  street: {
    number: { type: String },
    name: { type: String },
    preDirectional: { type: String },
    type: { type: String },
    unit: {
      number: { type: String },
    },
  },
  location: {
    city: { type: String },
    state: { type: String },
    zipCode: { type: Number },
  },
  dateReported: { type: String },
});

module.exports.accountsSchema = new mongoose.Schema({
  subscriber: {
    industryCode: { type: String },
    memberCode: { type: String },
    name: {
      unparsed: { type: String },
    },
  },
  portfolioType: { type: String },
  accountNumber: { type: String },
  ECOADesignator: { type: String },
  account: {
    type: { type: String },
  },
  dateOpened: { type: String },
  dateEffective: { type: String },
  currentBalance: { type: Number },
  original: {
    creditGrantor: {
      unparsed: { type: String },
    },
    creditorClassification: { type: String },
    balance: { type: Number },
  },
  highCredit: { type: Number },
  creditLimit: { type: Number },
  pastDue: { type: Number },
  accountRating: { type: String },
  remark: {
    code: { type: String },
    type: { type: String },
  },
  terms: {
    paymentScheduleMonthCount: { type: String },
    scheduledMonthlyPayment: { type: Number },
  },
  paymentHistory: {
    paymentPattern: {
      startDate: { type: String },
      text: { type: String },
    },
    historicalCounters: {
      monthsReviewedCount: { type: Number },
      late30DaysTotal: { type: Number },
      late60DaysTotal: { type: Number },
      late90DaysTotal: { type: Number },
    },
  },
  mostRecentPayment: {
    date: { type: String },
  },
  updateMethod: { type: String },
});

module.exports.creditSummarySchema = new mongoose.Schema({
  revolvingAmount: {
    percentAvailableCredit: { type: Number },
    highCredit: { type: Number },
    creditLimit: { type: Number },
    currentBalance: { type: Number },
    pastDue: { type: Number },
    monthlyPayment: { type: Number },
  },
  closedWithBalanceAmount: {
    currentBalance: { type: Number },
    pastDue: { type: Number },
    monthlyPayment: { type: Number },
  },
  totalAmount: {
    highCredit: { type: Number },
    creditLimit: { type: Number },
    currentBalance: { type: Number },
    pastDue: { type: Number },
    monthlyPayment: { type: Number },
  },
  recordCounts: {
    publicRecordCount: { type: Number },
    collectionCount: { type: Number },
    totalTradeCount: { type: Number },
    negativeTradeCount: { type: Number },
    historicalNegativeTradeCount: { type: Number },
    historicalNegativeOccurrencesCount: { type: Number },
    revolvingTradeCount: { type: Number },
    installmentTradeCount: { type: Number },
    mortgageTradeCount: { type: Number },
    openTradeCount: { type: Number },
    unspecifiedTradeCount: { type: Number },
    totalInquiryCount: { type: Number },
  },
});

module.exports.indicativeSchema = new mongoose.Schema({
  name: [
    {
      person: {
        first: { type: String },
        middle: { type: String },
        last: { type: String },
        generationalSuffix: { type: String },
      },
    },
    {
      qualifier: { type: String },
      person: {
        unparsed: { type: String },
      },
    },
  ],
  address: [this.addressSchema],
  socialSecurity: {
    number: { type: String },
  },
  dateOfBirth: { type: String },
  employment: {
    employer: {
      unparsed: { type: String },
    },
    dateOnFileSince: { type: String },
  },
});

module.exports.addOnProductSchema = new mongoose.Schema({
  code: { type: String },
  status: { type: String },
  scoreModel: {
    score: {
      results: { type: Number },
      derogatoryAlert: { type: Boolean },
      fileInquiriesImpactedScore: { type: Boolean },
      factors: {
        factor: [
          {
            rank: { type: Number },
            code: { type: Number },
          },
        ],
      },
    },
  },
});

module.exports.applicantSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  ssn: { type: String },
  firstName: { type: String },
  middleInit: { type: String },
  lastName: { type: String },
  suffix: { type: String },
  address: { type: String, required: false },
  address2: { type: String, required: false },
  addressNumber: { type: String, required: false },
  addressType: { type: String, required: false },
  addressPostDirection: { type: String, required: false },
  addressPreDirection: { type: String, required: false },
  addressUnit: { type: String, required: false },
  addressUnitType: { type: String, required: false },
  addressStreet: { type: String, required: false },
  zip: { type: String, required: false },
  zipPlus4: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  zipCode: { type: String, required: false },
  cellPhoneNumber: { type: String },
  faxPhoneNumber: { type: String },
  dobMonth: { type: Number },
  dobDay: { type: Number },
  dobYear: { type: Number },
  employer: { type: String },
  occupation: { type: String },
  workPhoneNumber: { type: String },
  maritalStatus: { type: String },
  hardshipReason: { type: String },
  tradeAccounts: [this.accountsSchema],
  collectionAccounts: [this.accountsSchema],
  creditSummary: { type: this.creditSummarySchema, required: false },
  indicative: this.indicativeSchema,
  addOnProduct: [this.addOnProductSchema],
});

module.exports.creditorsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  accountNumber: { type: String, required: true },
  currentApr: { type: Number },
  currentPayment: { type: Number },
  currentBalance: { type: Number },
});

module.exports.incomeSchema = new mongoose.Schema({
  monthlyNetPay: { type: Number },
  coApplicantMonthlyNetPay: { type: Number },
  ssnIncome: { type: Number },
  retirementPay: { type: Number },
  otherGovtBenefits: { type: Number },
  childSupport: { type: Number },
  allOtherIncome: { type: Number },
});

module.exports.expenseSchema = new mongoose.Schema({
  monthlyRent: { type: Number },
  mortgage: { type: Number },
  utilities: { type: Number },
  groceries: { type: Number },
  automobilePayments: { type: Number },
  automobileExpenses: { type: Number },
  medical: { type: Number },
  insurance: { type: Number },
  dayCare: { type: Number },
  childSupport: { type: Number },
  installmentLoans: { type: Number },
  allOther: { type: Number },
});
