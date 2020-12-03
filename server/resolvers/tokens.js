const moment = require('moment');

const CustomerCode = require('../models/CustomerCode');
const { ERRORS } = require('../constants/errors');
const convertError = require('../utils/convertErrors');
const { generateToken } = require('../utils/tokens');
const Customer = require('../models/Customer');

const connectDatabase = require('../models/connectDatabase');
const Application = require('../models/Application');
const { createNewApplication } = require('../utils/application');
const { omit } = require('lodash');

const createTokenResponse = ({ ok, token = null, errors = null }) => ({
  ok,
  token,
  errors,
});
const createApplicationAndTokenResponse = ({
  ok,
  token = null,
  application = null,
  errors = null,
}) => ({
  ok,
  token,
  application,
  errors,
});

const getCustomer = ({
  code = null,
  phoneNumber = null,
  customerId = null,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let customer;
      if (code && phoneNumber) {
        const customerCode = await CustomerCode.findOne({ code });
        if (!customerCode) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);
        const expiry = moment(customerCode.expiry).utc();

        const now = moment().utc();

        if (expiry.isBefore(now)) throw new Error(ERRORS.CODE.EXPIRED);

        // TODO: check for accounts in db for this user/code
        const customer = await Customer.findOne({
          phoneNumber,
          _id: customerCode.customerId,
        });
        if (!customer) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);

        customer.code = customerCode.code;
        resolve(customer);
      } else if (customerId) {
        const customer = await Customer.findById(customerId);
        resolve(customer);
      } else {
        throw new Error(ERRORS.CUSTOMER.NOT_FOUND);
      }
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });
};
module.exports = {
  Query: {
    getTokenByCodeAndPhoneNumber: async (
      parent,
      { code, phoneNumber },
      context
    ) => {
      try {
        await connectDatabase();

        const customer = await getCustomer({ code, phoneNumber });

        if (!customer) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);

        const token = await generateToken({
          user: {
            displayName: `${customer.firstName} ${customer.lastName}`,
            code: customer.code,
            id: customer.id,
          },
          type: 'Customer',
        });

        return createTokenResponse({
          ok: true,
          token,
        });
      } catch (error) {
        console.log('error', error);
        return createTokenResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
    getApplicationAndTokenByEmailAndPhoneNumber: async (
      parent,
      { input },
      context
    ) => {
      try {
        const { email, phoneNumber, createNew } = input;
        await connectDatabase();

        let application = await Application.findOne({
          'applicant.email': email,
        });

        console.log('existing application', application);
        console.log('createNew', createNew);

        if (createNew && !application) {
          application = await createNewApplication(omit(input, ['createNew']));
        }

        if (!application)
          throw new Error(ERRORS.APPLICATION.NOT_FOUND_WITH_PROVIDED_INFO);

        console.log('application', application);
        let token;
        if (application.applicant.phoneNumber === phoneNumber) {
          token = await generateToken({
            user: {
              displayName: `${application.applicant.firstName} ${application.applicant.lastName}`,
              id: application.id,
            },
            type: 'Application',
          });
        }

        return createApplicationAndTokenResponse({
          ok: true,
          token,
          application: application ? application.transform() : application,
        });
      } catch (error) {
        console.log('error', error);
        return createApplicationAndTokenResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
    getTokenByCustomerId: async (parent, { customerId }, context) => {
      try {
        await connectDatabase();

        const customer = await getCustomer({ customerId });

        if (!customer) throw new Error(ERRORS.CUSTOMER.NOT_FOUND);

        const token = await generateToken({
          user: {
            displayName: `${customer.firstName} ${customer.lastName}`,
            code: customer.code,
            id: customer.id,
          },
          type: 'Customer',
        });

        return createTokenResponse({
          ok: true,
          token,
        });
      } catch (error) {
        console.log('error', error);
        return createTokenResponse({
          ok: false,
          errors: convertError(error),
        });
      }
    },
  },
};
