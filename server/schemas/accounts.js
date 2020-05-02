const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Date
  type Account {
    id: String!
    creditorName: String!
    balance: Float!
    limit: Float!
    availableCredit: Float!
    accountRating: String!
    accountNumber: String!
    paymentDate: Date
    status: String!
  }

  input TransUnionInput {
    customerId: String!
    ssn: String!
    firstNane: String!
    middleName: String
    lastName: String!
    suffix: String
    addressNumber: String
    street: String
    addressType: String
    unit: String
    city: String
    state: String
    zip: String
  }

  type AccountsResponse {
    ok: Boolean!
    validAccounts: [Account]
    invalidAccounts: [Account]
    errors: [Error!]
  }

  type Query {
    getAccountsForCustomer(customerId: String!): AccountsResponse
    getAccountsFromCode(code: String!): AccountsResponse
    getAccountInformationFromTransUnion(
      input: TransUnionInput
    ): AccountsResponse
  }
`;

module.exports = typeDefs;
