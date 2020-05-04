const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type TuAccount {
    subscriber: TuSubscriber
    portfolioType: String
    accountNumber: String
    ECOADesignator: String
    account: TuAccountType
    dateOpened: String
    dateEffective: String
    currentBalance: Int
    original: TuOriginal
    highCredit: Int
    creditLimit: Int
    pastDue: Int
    accountRating: String
    remark: TuRemark
    terms: TuTerms
    paymentHistory: TuPaymentHistory
    mostRecentPayment: TuMostRecentPayment
    updateMethod: String
  }
  type TuCreditSummary {
    revolvingAmount: TuRevolvingAmount
    closedWithBalanceAmount: TuClosedWithBalanceAmount
    totalAmount: TuTotalAmount
    recordCounts: TuRecordCounts
  }

  type TuIndicative {
    name: [TuName]
    address: [TuAddress]
    socialSecurity: TuSocialSecurity
    dateOfBirth: String
    employment: TuEmployment
  }
  type TuAddOnProduct {
    code: String
    status: String
    scoreModel: TuScoreModel
  }

  type TuRecordCounts {
    publicRecordCount: Int
    collectionCount: Int
    totalTradeCount: Int
    negativeTradeCount: Int
    historicalNegativeTradeCount: Int
    historicalNegativeOccurrencesCount: Int
    revolvingTradeCount: Int
    installmentTradeCount: Int
    mortgageTradeCount: Int
    openTradeCount: Int
    unspecifiedTradeCount: Int
    totalInquiryCount: Int
  }

  type TuTotalAmount {
    highCredit: Int
    creditLimit: Int
    currentBalance: Int
    pastDue: Int
    monthlyPayment: Int
  }
  type TuClosedWithBalanceAmount {
    currentBalance: Int
    pastDue: Int
    monthlyPayment: Int
  }
  type TuRevolvingAmount {
    percentAvailableCredit: Int
    highCredit: Int
    creditLimit: Int
    currentBalance: Int
    pastDue: Int
    monthlyPayment: Int
  }
  type TuSubscriberName {
    unparsed: String
  }

  type TuSubscriber {
    industryCode: String
    memberCode: String
    name: TuSubscriberName
  }
  type TuAccountType {
    type: String
  }

  type TuCreditGrantor {
    unparsed: String
  }

  type TuOriginal {
    creditGrantor: TuCreditGrantor
    creditorClassification: String
    balance: Int
  }

  type TuRemark {
    code: String
    type: String
  }

  type TuTerms {
    paymentScheduleMonthCount: String
    scheduledMonthlyPayment: Int
  }

  type TuPaymentPatterns {
    startDate: String
    text: String
  }

  type TuPaymentHistoricalCounters {
    monthsReviewedCount: Int
    late30DaysTotal: Int
    late60DaysTotal: Int
    late90DaysTotal: Int
  }

  type TuPaymentHistory {
    paymentPattern: TuPaymentPatterns
    historicalCounters: TuPaymentHistoricalCounters
  }

  type TuMostRecentPayment {
    date: String
  }

  type TuPerson {
    first: String
    middle: String
    last: String
    generationalSuffix: String
  }
  type TuName {
    qualifier: String
    person: TuPerson
  }
  type TuSocialSecurity {
    number: String
  }

  type TuUnit {
    number: String
  }
  type TuStreet {
    number: String
    name: String
    preDirectional: String
    type: String
    unit: TuUnit
  }
  type TuLocation {
    city: String
    state: String
    zipCode: Int
  }

  type TuEmployer {
    unparsed: String
  }
  type TuEmployment {
    employer: TuEmployer
    dateOnFileSince: String
  }
  type TuAddress {
    status: String
    qualifier: String
    street: TuStreet
    location: TuLocation
    dateReported: String
  }

  type TuFactor {
    rank: Int
    code: Int
  }
  type TuFactors {
    factor: [TuFactor]
  }
  type TuScore {
    results: Int
    derogatoryAlert: Boolean
    fileInquiriesImpactedScore: Boolean
    factors: TuFactors
  }
  type TuScoreModel {
    score: TuScore
  }
`;

module.exports = typeDefs;
