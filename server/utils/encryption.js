const { createCipher, createDecipher } = require('crypto');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

module.exports.encrypt = (text) => {
  const cipher = createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  // console.log('cipher', cipher);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

module.exports.decrypt = (text) => {
  const decipher = createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);

  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

// const hw = this.encrypt('hello world');
// console.log(this.decrypt(hw));

// const algorithm = 'aes-256-cbc';

// // const key =  Buffer.from(process.env.ENCRYPTION_KEY);
// // const iv = Buffer.from(process.env.ENCRYPTION_IV);
// const key = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);

// module.exports.encrypt = (text) => {
//   let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
//   let encrypted = cipher.update(text);
//   encrypted = Buffer.concat([encrypted, cipher.final()]);
//   return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
// };

// module.exports.decrypt = (text) => {
//   let iv = Buffer.from(text.iv, 'hex');
//   let encryptedText = Buffer.from(text.encryptedData, 'hex');
//   let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
//   let decrypted = decipher.update(encryptedText);
//   decrypted = Buffer.concat([decrypted, decipher.final()]);
//   return decrypted.toString();
// };

// console.log('key', key);
// console.log('iv', iv);
// const encryptedText = this.encrypt('Michael Griffin');
// const decryptedText = this.decrypt(encryptedText);
// console.log('decryptedText', decryptedText);
