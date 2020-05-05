const { Router } = require('express');
const { json } = require('body-parser');
const { wrapErrors } = require('../../utils/errors');
const {
  getCreditSoftData,
  postCreditSoftData,
} = require('../../handlers');

const trackRequests = log => (req, res, next) => {
  const { headers, params, query, body } = req;
  log.trace({
    action: '/activity',
    request: {
      headers,
      params,
      query,
      body,
    },
  });
  return next();
};

const getCreditSoftHandler = async(req, res) => {
  const { query, headers } = req;

  const getCSData = await getCreditSoftData(query, headers);
  
  return res.send(getCSData);
};

const postCreditSoftHandler = async(req, res) => {
  //console.log('req.body', req.body.import.members);
  const { query, body, headers } = req;

  const postCSData = await postCreditSoftData(query, body, headers);
  
  return res.send(postCSData);
};

const creditsoft = (log) => {
  const api = Router();
  api.use('*', json(), trackRequests(log));
  api.get('/api', wrapErrors(getCreditSoftHandler));
  api.post('/api', wrapErrors(postCreditSoftHandler));
  return api;
}

module.exports = creditsoft;
