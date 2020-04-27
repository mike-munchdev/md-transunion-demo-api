module.exports = (e) => {
  return e.errors
    ? Object.keys(e.errors).map((key) => ({ message: e.errors[key].message }))
    : [{ message: e.message || String(e) }];
};
