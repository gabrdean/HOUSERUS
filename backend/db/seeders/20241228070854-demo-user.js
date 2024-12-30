

'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'turtle@gmail.com',
        username: 'shelly',
        firstName: 'Shell',
        lastName: 'Backard',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'creed@gmail.com',
        username: 'HiddenBlade',
        firstName: 'Ezio',
        lastName: 'Filipe',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'coffeebean@gmail.com',
        username: 'Wawa',
        firstName: 'Bird',
        lastName: 'Flora',
        hashedPassword: bcrypt.hashSync('password3')
      },

      {
        email: 'bookworm@gmail.com',
        username: 'Alchemist',
        firstName: 'Paul',
        lastName: 'Coral',
        hashedPassword: bcrypt.hashSync('password4')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['shelly', 'HiddenBlade', 'Wawa','Alchemist'] }
    }, {});
  }
};
