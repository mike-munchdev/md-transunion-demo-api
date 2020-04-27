const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Client {
    code: String!
    email: String!
    firstName: String!
    lastName: String!
  }

  type ClientResponse {
    ok: Boolean!
    client: Client
    errors: [Error!]
  }

  input CreateInitialClientInput {
    firstName: String!
    lastName: String!
    email: String!
  }

  type Query {
    getClientByCode(code: String!): ClientResponse
  }

  type Mutation {
    createInitialPotentialClientWithCode(
      input: CreateInitialClientInput
    ): ClientResponse
  }
`;

module.exports = typeDefs;
