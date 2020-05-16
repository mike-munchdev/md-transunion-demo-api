const chars = [...process.env.CODE_CHARACTERS];

module.exports.generateCode = (codeLength = 0) => {
  return [...Array(codeLength)]
    .map((i) => chars[Math.floor(Math.random() * chars.length)])
    .join('');
};
