const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Customer {
    id: String!
    code: String
    email: String
    firstName: String!
    middleName: String
    lastName: String!
    suffix: String
    phoneNumber: String!
    ssn: String
    address: String
    address2: String
    city: String
    state: String
    zip: String
    accountCount: Int
  }

  type CustomerResponse {
    ok: Boolean!
    customer: Customer
    errors: [Error!]
  }

  input CreateCustomerInput {
    email: String
    firstName: String!
    middleName: String
    lastName: String!
    suffix: String
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
    email: String
    firstName: String
    middleName: String
    lastName: String
    suffix: String
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
