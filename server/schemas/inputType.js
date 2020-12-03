const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  input ApplicantInput {
    firstName: String
    middleName: String
    lastName: String
    address: String
    address2: String
    city: String
    state: String!
    zip: String
    email: String!
    phoneNumber: String!
    cellPhoneNumber: String
    faxPhoneNumber: String
    dobMonth: Int
    dobDay: Int
    dobYear: Int
    ssn: String
    employer: String
    occupation: String
    workPhoneNumber: String
    maritalStatus: String
    hardshipReason: String
  }
`;

module.exports = typeDefs;
