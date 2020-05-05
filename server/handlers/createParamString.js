const createParamString = params => Object.keys(params)
  .filter(key => params[key] !== undefined)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  .join('&');

module.exports = createParamString;
