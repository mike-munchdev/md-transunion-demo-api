const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const connectDatabase = require('../models/connectDatabase');

const validateToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, secret);

      resolve(decoded);
    } catch (e) {
      reject(e);
    }
  });
};

const findCustomer = (decoded) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (decoded.info.code) {
        await connectDatabase();
        const customer = await Customer.findById(decoded.info.id);
        resolve(customer);
      } else {
        throw new Error('Malformed token');
      }
    } catch (e) {
      reject(e);
    }
  });
};

const generateToken = ({ user, type }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const today = new Date();
      const expirationDate = new Date(today);
      expirationDate.setDate(today.getDate() + 30);
      const token = jwt.sign(
        {
          info: user,
          type,
          exp: parseInt((expirationDate.getTime() / 1000).toString(), 10),
        },
        process.env.JWT_SECRET
      );

      resolve(token);
    } catch (e) {
      console.log('e', e);
      reject(e);
    }
  });
};

module.exports = { validateToken, findCustomer, generateToken };
