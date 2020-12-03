const { ERRORS } = require('../constants/errors');
const Application = require('../models/Application');
const {
  addressFieldsChanged,
  tamuAddressFieldsFound,
  getAddressFields,
  getTamuAddressInformation,
} = require('./customer');
const { pick } = require('lodash');

module.exports.verifyApplication = ({ input, application }) => {
  return new Promise((resolve, reject) => {
    try {
      const applicationVerified =
        input.firstName.toUpperCase() ===
          application.applicant.firstName.toUpperCase() &&
        input.lastName.toUpperCase() ===
          application.applicant.lastName.toUpperCase();
      if (!applicationVerified)
        throw new Error(ERRORS.APPLICATION.NOT_FOUND_WITH_PROVIDED_INFO);

      resolve(applicationVerified);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.createNewApplication = async (input) => {
  try {
    let application = new Application({
      applicant: input,
    });
    await application.save();

    return application;
  } catch (error) {
    return error;
  }
};

// function isn't pure it will change customer data.
module.exports.performAddressVerificationAndUpdateApplicantAddressFields = ({
  application,
  fields,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      // when submitting check if address matches previously stored address.
      const areAddressFieldChanged = addressFieldsChanged({
        input: application.appliant,
        fields,
      });

      // if yes = check tamu address values exist in db
      const areTamuFieldsFound = tamuAddressFieldsFound(application);

      // no changes were made and we have tamufields just return
      if (!areAddressFieldChanged && areTamuFieldsFound) resolve(application);

      // if address fields changed let's update them and do a lookup;
      let updatedApplication;
      let addressInformation;

      // if address fields changed or if we don't have tamufields go get them.
      if (areAddressFieldChanged || !areTamuFieldsFound) {
        // update if address changed otherwise just get the
        const updateApplicantFields = getAddressFields(fields);
        updatedApplication = await Application.findOneAndUpdate(
          { _id: application.id },
          { applicant: updateApplicantFields },
          {
            upsert: false,
            new: true,
          }
        );

        // get tamu information
        addressInformation = await getTamuAddressInformation({
          input: updatedApplication,
        });

        const addressBody = pick(addressInformation, [
          'Number',
          'PreDirectional',
          'StreetName',
          'Suffix',
          'SuiteNumber',
          'PostDirectional',
          'ZIP',
          'ZIPPlus4',
        ]);

        // store tamu fields in database
        updatedApplication = await Application.findOneAndUpdate(
          { _id: application.id },
          {
            addressStreet: addressBody.StreetName,
            addressPreDirection: addressBody.PreDirectional,
            addressPostDirection: addressBody.PostDirectional,
            addressType: addressBody.Suffix,
            addressNumber: addressBody.Number,
            addressUnit: addressBody.SuiteNumber,
            zip: addressBody.ZIP,
            zipPlus4: addressBody.ZIPPlus4,
          },
          {
            upsert: false,
            new: true,
          }
        );

        resolve(updatedApplication);
      } else {
        resolve(application);
      }
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });
};
