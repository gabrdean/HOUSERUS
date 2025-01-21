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
        spotId: 1, 
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Katsura_Imperial_Villa_in_Spring.jpg/240px-Katsura_Imperial_Villa_in_Spring.jpg",
        preview: true
      },
      {
        spotId: 1,
        url: "https://example.com/spot1-image2.jpg",
        preview: false
      },
      {
        spotId: 2, 
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Ranch_style_home_in_Salinas%2C_California.JPG/240px-Ranch_style_home_in_Salinas%2C_California.JPG",
        preview: true
      },
      {
        spotId: 3, 
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Schweizerhaus_Schlo%C3%9Fpark_Ritzeb%C3%BCttel_2013_edit_%28MK%29.jpg/1200px-Schweizerhaus_Schlo%C3%9Fpark_Ritzeb%C3%BCttel_2013_edit_%28MK%29.jpg",
        preview: true
      },
      {
        spotId: 3, 
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
