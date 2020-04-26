const Umzug = require('umzug');
const path = require('path');
const db = require('../models/index');

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: db.sequelize,
    tableName: 'SequelizeSeed',
    modelName: 'SequelizeSeed'
  },

  // see: https://github.com/sequelize/umzug/issues/17
  migrations: {
    params: [
      db.sequelize.getQueryInterface(), // queryInterface
      db.sequelize.constructor, // DataTypes
      function() {
        throw new Error(
          'Seeders tried to use old style "done" callback. Please upgrade to umzug and return a promise instead.'
        );
      }
    ],
    path: path.join(__dirname, '../seeders'),
    pattern: /\.js$/
  },

  logging: function() {
    console.log.apply(null, arguments);
  }
});

module.exports.seedDatabase = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const seeds = await umzug.pending();

      if (seeds.length > 0) {
        const completed = await umzug.up();

        resolve(completed);
      } else {
        resolve(seeds);
      }
    } catch (e) {
      reject(e);
    }
  });
};
    
