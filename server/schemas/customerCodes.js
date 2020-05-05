const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type CustomerCode {
    id: ID!
    code: String
    expiry: Date
  }

  type CustomerCodeResponse {
    ok: Boolean!
    customerCode: CustomerCode
    errors: [Error!]
  }

  input CreateCustomerCodeInput {
    customerId: String!
  }

  type Query {
    getCustomerCodeByCustomerId(customerId: String!): CustomerCodeResponse
  }

  type Mutation {
    createCustomerCodeForCustomer(
      input: CreateCustomerCodeInput
    ): CustomerCodeResponse
  }
`;

module.exports = typeDefs;
