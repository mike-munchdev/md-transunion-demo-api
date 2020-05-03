const {
  AuthenticationError,
  SchemaError,
  ForbiddenError,
} = require('apollo-server-express');
const { validateToken, findCustomer } = require('./tokens');

module.exports = async (args) => {
  try {
    let user;

    if (args.req) {
      const { query } = args.req.body;

      if (query) {
        const arr = query.split('\n');

        if (arr.length)
          if (
            arr[1].includes('getTokenByCodeAndPhoneNumber(') ||
            arr[1].includes('createCustomer(') ||
            arr[1].includes('createCustomerCodeForCustomer(') ||
            arr[1].includes('getAccountInformationFromTransUnion(') ||
            arr[1].includes('getCustomerCodeByCustomerId(') ||
            arr[0].includes('query IntrospectionQuery {')
          ) {
            return { req: args.req, res: args.res };
          } else {
            const req = args.req;

            const token = req.header('x-auth');

            if (!token) throw new ForbiddenError('missing token');

            const decoded = await validateToken(token, process.env.JWT_SECRET);

            user = await findCustomer(decoded);

            if (!user) {
              const ip =
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.ips;
              const errorMessage = `#badtoken User with token ${token} not found. IP: ${ip}`;

              throw new ForbiddenError(errorMessage);
            }

            return { user, req: args.req, res: args.res };
          }
      } else {
        throw new SchemaError('Schema invalid');
      }
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};
