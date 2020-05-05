const fetch = require('node-fetch');
const createParamString = require('./createParamString');
const { isJsonResponse, nonJsonErrorMsg } = require('../utils/responseValidation');
const { noticeError, errorObject } = require('../utils/errors');

const postCreditSoftData = async (query, body, headers) => {

  const { path } = query;
  const { authorization } = headers;

  const pathToUse = (path && path.indexOf('/') > -1) ? path : '';

  const url = `${process.env.CSOFT_API_BASE}${pathToUse}`;
  
  const options = {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      authorization,
      'content-type': 'application/json',
    },
  };

  const response = await fetch(url, options);
  const validResponse = isJsonResponse(response);
  const responseBody = validResponse ? await response.json() : await response.text();
  if (validResponse && response.status < 300) {
    return responseBody;
  }

  const errorStatus = response.status >= 300 ? response.status : 500;
  const errorBody = validResponse ? JSON.stringify(responseBody) : nonJsonErrorMsg(responseBody);
  const errMsgAdd = !validResponse ? 'Invalid JSON' : '';
  const errMsg = `postCreditSoftData backend error ${errMsgAdd}`;
  const errObj = errorObject(errMsg, errorBody, errorStatus);
  noticeError(errObj);
  return errObj;
};

const getCreditSoftData = async (query, headers) => {
  const { path, LeadID, token } = query;
  const params = { LeadID, token };
  const { authorization } = headers;

  const pathToUse = (path && path.indexOf('/') > -1) ? path : '';
  const url = `${process.env.CSOFT_API_BASE}${pathToUse}?${createParamString(params)}`;
  
  const options = {
    method: 'get',
    headers: {
      authorization,
    },
  };

  const response = await fetch(url, options);
  const validResponse = isJsonResponse(response);
  const responseBody = validResponse ? await response.json() : await response.text();
  if (validResponse && response.status < 300) {
    return responseBody;
  }

  const errorStatus = response.status >= 300 ? response.status : 500;
  const errorBody = validResponse ? JSON.stringify(responseBody) : nonJsonErrorMsg(responseBody);
  const errMsgAdd = !validResponse ? 'Invalid JSON' : '';
  const errMsg = `getCreditSoftData backend error ${errMsgAdd}`;
  const errObj = errorObject(errMsg, errorBody, errorStatus);
  noticeError(errObj);
  return errObj;

};

module.exports = { postCreditSoftData, getCreditSoftData };
