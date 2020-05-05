const isJsonResponse = response =>
    response
    && response.headers
    && response.headers.get('content-type')
    && response.headers.get('content-type').indexOf('json') > -1;

const isJsonString = (str) => {
  try {
      JSON.parse(str);
  } catch (e) {
      console.log('cannot parse json');
      return false;
  }
  return true;
}

const nonJsonErrorMsg = (response) => {
  const message = response.statusText;
  let errorMessage = { message };
  if (response.status === 200) {
    errorMessage = { message: 'Invalid JSON' };
  }
  return JSON.stringify(errorMessage);
};

module.exports = { isJsonResponse, isJsonString, nonJsonErrorMsg };
