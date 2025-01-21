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
        userId: 2,
        spotId: 1,
        review: 'Beautiful canal views and authentic Amsterdam experience. The beam ceilings add so much character!',
        stars: 5
      },
      {
        userId: 3,
        spotId: 1,
        review: 'Great location near museums, but the stairs are quite steep. Pack light!',
        stars: 4
      },

      // Tropical Paradise (spotId: 2)
      {
        userId: 1,
        spotId: 2,
        review: 'The private pool was amazing! Perfect temperature and the garden is beautifully maintained.',
        stars: 5
      },
      {
        userId: 3,
        spotId: 2,
        review: 'Close to South Beach as advertised, but the A/C struggled during peak afternoon heat.',
        stars: 4
      },

      // Urban Lakefront Loft (spotId: 3)
      {
        userId: 4,
        spotId: 3,
        review: 'The views of Lake Michigan are breathtaking! Perfect spot for watching the sunrise.',
        stars: 5
      },
      {
        userId: 3,
        spotId: 3,
        review: 'High-end finishes and great location. The balcony is smaller than it appears in photos.',
        stars: 4
      },

      // Evergreen Retreat (spotId: 4)
      {
        userId: 1,
        spotId: 4,
        review: 'Peaceful forest setting with lots of wildlife. The deck is perfect for morning coffee.',
        stars: 5
      },
      {
        userId: 2,
        spotId: 4,
        review: 'Cozy cabin feel but with modern amenities. Could use better lighting in the kitchen.',
        stars: 4
      },

      // Urban Oasis (spotId: 6)
      {
        userId: 1,
        spotId: 6,
        review: 'The rooftop pool is fantastic! Great views of Austin and perfect for sunset swims.',
        stars: 5
      },
      {
        userId: 3,
        spotId: 6,
        review: 'Location is perfect for music lovers. Some street noise at night, but worth it for the convenience.',
        stars: 4
      },

      // Alpine Hideaway (spotId: 8)
      {
        userId: 2,
        spotId: 8,
        review: 'The mountain views are incredible! Hot tub under the stars was a highlight.',
        stars: 5
      },
      {
        userId: 3,
        spotId: 8,
        review: 'Well-appointed home with great hiking access. Minor issue with wifi stability.',
        stars: 4
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 6, 8] }
    }, {});
  }
};
