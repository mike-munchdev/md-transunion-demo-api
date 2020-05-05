const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type TokenResponse {
    ok: Boolean!
    token: String
    errors: [Error!]
  }

  type Query {
    getTokenByCodeAndPhoneNumber(
      code: String!
      phoneNumber: String!
    ): TokenResponse
    getTokenByCustomerId(customerId: String!): TokenResponse
  }
`;

module.exports = typeDefs;
