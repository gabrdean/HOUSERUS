'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 1, 
        spotId: 3, 
        review: 'Amazing place to stay! Highly recommended.',
        stars: 5
      },
      {
        userId: 2, 
        spotId: 1, 
        review: 'The location was convenient, but the amenities could be better.',
        stars: 3
      },
      {
        userId: 3, 
        spotId: 2, 
        review: 'Lovely spot near the beach. Great experience overall!',
        stars: 4
      },
      {
        userId: 1, 
        spotId: 3, 
        review: 'Not worth the price. The cleanliness was subpar.',
        stars: 2
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: {
        [Op.in]: [
          'Amazing place to stay! Highly recommended.',
          'The location was convenient, but the amenities could be better.',
          'Lovely spot near the beach. Great experience overall!',
          'Not worth the price. The cleanliness was subpar.'
        ]
      }
    }, {});
  }
};
