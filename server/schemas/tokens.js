const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type TokenResponse {
    ok: Boolean!
    token: String
    errors: [Error!]
  }
  type ApplicationAndTokenResponse {
    ok: Boolean!
    token: String
    application: Application
    errors: [Error!]
  }

  input GetApplicationAndTokenInput {
    firstName: String
    middleName: String
    lastName: String
    address: String
    address2: String
    city: String
    state: String
    zip: String
    email: String!
    phoneNumber: String!
    cellPhoneNumber: String
    faxPhoneNumber: String
    dobMonth: Int
    dobDay: Int
    dobYear: String
    createNew: Boolean
  }

  type Query {
    getTokenByCodeAndPhoneNumber(
      code: String!
      phoneNumber: String!
    ): TokenResponse
    getTokenByCustomerId(customerId: String!): TokenResponse
    getApplicationAndTokenByEmailAndPhoneNumber(
      input: GetApplicationAndTokenInput!
    ): ApplicationAndTokenResponse
  }
`;

module.exports = typeDefs;
