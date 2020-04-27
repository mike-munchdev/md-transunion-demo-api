const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Date
  type Account {
    creditorName: String!
    balance: Float!
    limit: Float!
    availableCredit: Float!
    accountRating: String!
    accountNumber: String!
    paymentDate: Date
    status: String!
  }

  type AccountsResponse {
    ok: Boolean!
    accounts: [Account]
    errors: [Error!]
  }

  type Query {
    getAccountsForUser(userId: String!): AccountsResponse
    getAccountsFromCode(code: String!): AccountsResponse
  }
`;

module.exports = typeDefs;
