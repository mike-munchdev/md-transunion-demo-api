const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Date
  type Account {
    id: String!
    customerId: String!
    tradeAccounts: [TuAccount]
    collectionAccounts: [TuAccount]
    creditSummary: TuCreditSummary
    indicative: TuIndicative
    addOnProduct: TuAddOnProduct
  }

  input TransUnionInput {
    customerId: String!
    ssn: String
    addressUnit: String
    lastName: String
    addressStreet: String
    zipCode: String
    addressPreDirection: String
    addressPostDirection: String
    state: String
    firstName: String
    city: String
    addressType: String
    addressNumber: String
    middleInit: String
  }

  type AccountsResponse {
    ok: Boolean!
    accounts: Account
    errors: [Error!]
  }

  type Query {
    getAccountsForCustomer(customerId: String!): AccountsResponse
    getAccountsFromCode(code: String!): AccountsResponse
    getAccountInformationFromTransUnion(
      input: TransUnionInput!
    ): AccountsResponse
  }
`;

module.exports = typeDefs;
