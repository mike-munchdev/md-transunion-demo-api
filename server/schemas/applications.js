const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Date

  type Application {
    id: ID!
    applicant: Applicant!
    coApplicant: Applicant
    income: [Income!]
    expenses: [Expense!]
    creditors: [Creditor!]
    bankName: String
    bankRoutingName: String
    bankAccountNumber: String
    bankAccountType: String
    dayToMakePayment: Int
    secondDayToMakePayment: Int
    monthToStart: Int
    contract: String
    supportingDocuments: [String!]
    createdAt: Date
    updatedAt: Date
  }

  input CreateApplicationInput {
    email: String!
    phoneNumber: String!
    state: String!
  }

  input UpdateApplicationInput {
    applicationId: String!
    application: ApplicantInput
    coApplication: ApplicantInput
    bankName: String
    bankRoutingName: String
    bankAccountNumber: String
    bankAccountType: String
    dayToMakePayment: Int
    secondDayToMakePayment: Int
    monthToStart: Int
    contract: String
  }
  type ApplicationResponse {
    ok: Boolean!
    application: Application
    errors: [Error!]
  }

  type Query {
    getApplicationById(applicationId: String!): ApplicationResponse
    getCreditInformationFromTransUnionByApplicationId(
      applicationId: String!
    ): ApplicationResponse
  }

  type Mutation {
    createApplication(input: CreateApplicationInput!): ApplicationResponse
    updateApplication(input: UpdateApplicationInput!): ApplicationResponse
  }
`;

module.exports = typeDefs;
