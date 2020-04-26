const Umzug = require('umzug');
const path = require('path');
const db = require('../models/index');

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: db.sequelize
  },

  // see: https://github.com/sequelize/umzug/issues/17
  migrations: {
    params: [
      db.sequelize.getQueryInterface(), // queryInterface
      db.sequelize.constructor, // DataTypes
      function() {
        throw new Error(
          'Migration tried to use old style "done" callback. Please upgrade to umzug and return a promise instead.'
        );
      }
    ],
    path: path.join(__dirname, '../migrations'),
    pattern: /\.js$/
  },

  logging: function() {
    console.log.apply(null, arguments);
  }
});

module.exports.migrateDatabase = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const migrations = await umzug.pending();

      if (migrations.length > 0) {
        const completed = await umzug.up();

        resolve(completed);
      } else {
        resolve(migrations);
      }
    } catch (e) {
      reject(e);
    }
  });
};
    
