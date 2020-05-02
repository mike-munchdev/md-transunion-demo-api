const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Customer {
    id: String!
    code: String
    email: String
    firstName: String!
    lastName: String!
    phoneNumber: String!
    ssn: String
    address: String
    address2: String
    city: String
    state: String
    zip: String
  }

  type CustomerResponse {
    ok: Boolean!
    customer: Customer
    errors: [Error!]
  }

  input CreateCustomerInput {
    firstName: String!
    lastName: String!
    email: String
    phoneNumber: String!
    ssn: String
    address: String
    address2: String
    city: String
    state: String
    zip: String
  }

  input UpdateCustomerInput {
    customerId: String!
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    ssn: String
    address: String
    address2: String
    city: String
    state: String
    zip: String
  }

  type Query {
    getCustomerById(customerId: String!): CustomerResponse
  }

  type Mutation {
    createCustomer(input: CreateCustomerInput): CustomerResponse
    updateCustomer(input: UpdateCustomerInput): CustomerResponse
  }
`;

module.exports = typeDefs;
