'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,  
        address: '123 Demo St',
        city: 'Demo City',
        state: 'DC',
        country: 'CountryName',
        lat: 12.3456,
        lng: 65.4321,
        name: 'Demo Spot 1',
        description: 'A beautiful spot to relax and enjoy.',
        price: 100.00,
        previewImage: true,
        avgRating: 4.5
      },
      {
        ownerId: 2,  
        address: '456 Fake Rd',
        city: 'Fake City',
        state: 'FC',
        country: 'CountryName',
        lat: 87.000,
        lng: 32.1098,
        name: 'Fake Spot 2',
        description: 'A cozy place for a getaway.',
        price: 150.00,
        previewImage: false,
        avgRating: 4.0
      },
      {
        ownerId: 3,  // And another demo owner
        address: '789 Sample Ave',
        city: 'Sample City',
        state: 'SC',
        country: 'CountryName',
        lat: 56.7890,
        lng: 12.3456,
        name: 'Sample Spot 3',
        description: 'A nice spot near the beach.',
        price: 200.00,
        previewImage: true,
        avgRating: 5.0
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Demo Spot 1', 'Fake Spot 2', 'Sample Spot 3'] }
    }, {});
  }
};
