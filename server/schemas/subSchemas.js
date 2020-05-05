const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type TuAccount {
    id: String!
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
    id: String!
    revolvingAmount: TuRevolvingAmount
    closedWithBalanceAmount: TuClosedWithBalanceAmount
    totalAmount: TuTotalAmount
    recordCounts: TuRecordCounts
  }

  type TuIndicative {
    id: String!
    name: [TuName]
    address: [TuAddress]
    socialSecurity: TuSocialSecurity
    dateOfBirth: String
    employment: TuEmployment
  }
  type TuAddOnProduct {
    id: String!
    code: String
    status: String
    scoreModel: TuScoreModel
  }

  type TuRecordCounts {
    id: String!
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
    id: String!
    highCredit: Int
    creditLimit: Int
    currentBalance: Int
    pastDue: Int
    monthlyPayment: Int
  }
  type TuClosedWithBalanceAmount {
    id: String!
    currentBalance: Int
    pastDue: Int
    monthlyPayment: Int
  }
  type TuRevolvingAmount {
    id: String!
    percentAvailableCredit: Int
    highCredit: Int
    creditLimit: Int
    currentBalance: Int
    pastDue: Int
    monthlyPayment: Int
  }
  type TuSubscriberName {
    id: String!
    unparsed: String
  }

  type TuSubscriber {
    id: String!
    industryCode: String
    memberCode: String
    name: TuSubscriberName
  }
  type TuAccountType {
    id: String!
    type: String
  }

  type TuCreditGrantor {
    id: String!
    unparsed: String
  }

  type TuOriginal {
    id: String!
    creditGrantor: TuCreditGrantor
    creditorClassification: String
    balance: Int
  }

  type TuRemark {
    id: String!
    code: String
    type: String
  }

  type TuTerms {
    id: String!
    paymentScheduleMonthCount: String
    scheduledMonthlyPayment: Int
  }

  type TuPaymentPatterns {
    id: String!
    startDate: String
    text: String
  }

  type TuPaymentHistoricalCounters {
    id: String!
    monthsReviewedCount: Int
    late30DaysTotal: Int
    late60DaysTotal: Int
    late90DaysTotal: Int
  }

  type TuPaymentHistory {
    id: String!
    paymentPattern: TuPaymentPatterns
    historicalCounters: TuPaymentHistoricalCounters
  }

  type TuMostRecentPayment {
    id: String!
    date: String
  }

  type TuPerson {
    id: String!
    first: String
    middle: String
    last: String
    generationalSuffix: String
  }
  type TuName {
    id: String!
    qualifier: String
    person: TuPerson
  }
  type TuSocialSecurity {
    id: String!
    number: String
  }

  type TuUnit {
    id: String!
    number: String
  }
  type TuStreet {
    id: String!
    number: String
    name: String
    preDirectional: String
    type: String
    unit: TuUnit
  }
  type TuLocation {
    id: String!
    city: String
    state: String
    zipCode: Int
  }

  type TuEmployer {
    id: String!
    unparsed: String
  }
  type TuEmployment {
    id: String!
    employer: TuEmployer
    dateOnFileSince: String
  }
  type TuAddress {
    id: String!
    status: String
    qualifier: String
    street: TuStreet
    location: TuLocation
    dateReported: String
  }

  type TuFactor {
    id: String!
    rank: Int
    code: Int
  }
  type TuFactors {
    id: String!
    factor: [TuFactor]
  }
  type TuScore {
    id: String!
    results: Int
    derogatoryAlert: Boolean
    fileInquiriesImpactedScore: Boolean
    factors: TuFactors
  }
  type TuScoreModel {
    id: String!
    score: TuScore
  }
`;

module.exports = typeDefs;
