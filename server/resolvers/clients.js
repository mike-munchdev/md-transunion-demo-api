const shortid = require('shortid');

const convertError = require('../utils/convertErrors');
const Client = require('../models/Client');

const connectDatabase = require('../models/connectDatabase');

const createClientResponse = ({ ok, client = null, errors = null }) => ({
  ok,
  client,
  errors,
});

module.exports = {
  Query: {
    getClientByCode: async (parent, { code }, context) => {
      try {
        await connectDatabase();

        // TODO: check for accounts in db for this user/code
        const client = await Client.findOne({ code });

        return createClientResponse({
          ok: true,
          client,
        });
      } catch (error) {
        return createClientResponse({
          ok: false,

          errors: convertError(error),
        });
      }
    },
  },
  Mutation: {
    createInitialPotentialClientWithCode: async (
      parent,
      { input },
      context
    ) => {
      try {
        const { firstName, lastName, email } = input;
        const code = shortid.generate();

        await connectDatabase();
        const client = await Client.create({
          email,
          firstName,
          lastName,
          code,
        });

        return createClientResponse({
          ok: true,
          client,
        });
      } catch (error) {
        return createClientResponse({
          ok: false,

          errors: convertError(error),
        });
      }
    },
  },
};
