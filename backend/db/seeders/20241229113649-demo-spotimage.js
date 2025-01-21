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
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Lovell_Beach_House_photo_D_Ramey_Logan.jpg/1200px-Lovell_Beach_House_photo_D_Ramey_Logan.jpg",
        preview: false
      },
      {
        spotId: 5,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Lima_Beach_House.jpg/1200px-Lima_Beach_House.jpg",
        preview: true
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
        spotId: 4, 
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Cingh-house.jpg/1200px-Cingh-house.jpg",
        preview: true
      },
      {
        spotId: 6, 
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/House_in_Bhutan_02.jpg/1200px-House_in_Bhutan_02.jpg",
        preview: true
      },
      {
        spotId: 7, 
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Bureg%C3%A5rden_October_2013_03.jpg/1200px-Bureg%C3%A5rden_October_2013_03.jpg",
        preview: true
      },
      {
        spotId: 8, 
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Feldbrunnen_Baselstrasse-2.jpg/1200px-Feldbrunnen_Baselstrasse-2.jpg",
        preview: true
      }

    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3,4,5,6,7,8] }
    }, {});
  }
};
