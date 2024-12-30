'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1, // References Demo Spot 1
        url: "https://example.com/spot1-image1.jpg",
        preview: true
      },
      {
        spotId: 1, // Another image for Demo Spot 1
        url: "https://example.com/spot1-image2.jpg",
        preview: false
      },
      {
        spotId: 2, // References Fake Spot 2
        url: "https://example.com/spot2-image1.jpg",
        preview: true
      },
      {
        spotId: 3, // References Sample Spot 3
        url: "https://example.com/spot3-image1.jpg",
        preview: true
      },
      {
        spotId: 3, // Another image for Sample Spot 3
        url: "https://example.com/spot3-image2.jpg",
        preview: false
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
