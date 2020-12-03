const moment = require('moment');

const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');

const Application = require('../models/Application');

const connectDatabase = require('../models/connectDatabase');
const { createNewApplication } = require('../utils/application');
const { pick } = require('lodash');

const createApplicationResponse = ({
  ok,
  application = null,
  errors = null,
}) => ({
  ok,
  application: application ? application.transform() : null,
  errors,
});

module.exports = {
  Query: {
    getCreditInformationFromTransUnionByApplicationId: async (
      parent,
      { applicationId },
      { isAdmin }
    ) => {
      try {
        await connectDatabase();
        // TODO: check for accounts in db for this user/code
        let application = await Application.findById(applicationId);

        if (!application) throw new Error(ERRORS.APPLICATION.NOT_FOUND);
        console.log('application', application);
        if (
          !application ||
          (application.applicant.tradeAccounts.length === 0 &&
            application.applicant.collectionAccounts.length === 0)
        ) {
          console.log('getting transunion info');
          const tuRequestBody = pick(application.applicant, [
            'ssn',
            'addressUnit',
            'lastName',
            'addressStreet',
            'firstName',
            'zipCode',
            'addressPreDirection',
            'addressPostDirection',
            'state',
            'city',
            'addressType',
            'addressNumber',
            'middleInit',
          ]);
        }
        return createApplicationResponse({
          ok: true,
          application,
        });
      } catch (error) {
        return createApplicationResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
    getApplicationById: async (parent, { applicationId }, { isAdmin }) => {
      try {
        await connectDatabase();

        // TODO: check for accounts in db for this user/code
        let application = await Application.findById(applicationId);

        if (!application) throw new Error(ERRORS.APPLICATION.NOT_FOUND);

        if (!application)
          throw new Error(ERRORS.APPLICATION.NOT_FOUND_WITH_PROVIDED_INFO);

        return createApplicationResponse({
          ok: true,
          application,
        });
      } catch (error) {
        return createApplicationResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
  },
  Mutation: {
    createApplication: async (parent, { input }, { isAdmin }) => {
      try {
        await connectDatabase();

        const existingApplication = Application.findOne({
          email: input.email,
          phoneNumber: input.phoneNumber,
        });

        let response;
        if (!existingApplication) {
          const application = createNewApplication(input);
          response = createApplicationResponse({
            ok: true,
            application,
          });
        } else {
          response = createApplicationResponse({
            ok: true,
            application: existingApplication,
          });
        }

        return response;
      } catch (error) {
        return createApplicationResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
    updateApplication: async (parent, { input }, { isAdmin }) => {
      try {
        const { applicationId } = input;
        if (!applicationId) throw new Error(ERRORS.CUSTOMER.ID_REQUIRED);
        let updateValues = input; // removeSensitiveFields(input);
        await connectDatabase();
        let application = await Application.findById(applicationId);

        if (!application) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);

        // update all other information
        application = await Application.findOneAndUpdate(
          { _id: applicationId },
          updateValues,
          {
            upsert: false,
          }
        );

        return createApplicationResponse({
          ok: true,
          application,
        });
      } catch (error) {
        console.log('error', error);
        return createApplicationResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
  },
};
