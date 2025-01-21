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
        address: '725 Canal Walk',
        city: 'Amsterdam',
        state: 'NH',
        country: 'Netherlands',
        lat: 52.3676,
        lng: 4.9041,
        name: 'Canal House Gem',
        description: 'Historic canal-side apartment with original beam ceilings and modern amenities. Steps from the museum quarter.',
        price: 295.00,
        previewImage: true,
        avgRating: 4.8
      },
      {
        ownerId: 2,
        address: '1834 Palmetto Drive',
        city: 'Miami',
        state: 'FL',
        country: 'United States',
        lat: 25.7617,
        lng: -80.1918,
        name: 'Tropical Paradise',
        description: 'Luxurious villa with private pool and lush gardens. Minutes from South Beach and vibrant nightlife.',
        price: 375.00,
        previewImage: true,
        avgRating: 4.7
      },
      {
        ownerId: 2,
        address: '391 Lakeside Terrace',
        city: 'Chicago',
        state: 'IL',
        country: 'United States',
        lat: 41.8781,
        lng: -87.6298,
        name: 'Urban Lakefront Loft',
        description: 'Sophisticated penthouse with panoramic lake views and private balcony. Walk to Millennium Park and the Art Institute.',
        price: 285.00,
        previewImage: true,
        avgRating: 4.9
      },
      {
        ownerId: 3,
        address: '2847 Maple Grove Drive',
        city: 'Portland',
        state: 'OR',
        country: 'United States',
        lat: 45.5155,
        lng: -122.6789,
        name: 'Evergreen Retreat',
        description: 'Cozy woodland cabin nestled in towering pines, featuring a wraparound deck perfect for morning coffee.',
        price: 175.00,
        previewImage: true,
        avgRating: 4.8
      },
      {
        ownerId: 4,
        address: '157 Harbour View Road',
        city: 'Vancouver',
        state: 'BC',
        country: 'Canada',
        lat: 49.2827,
        lng: -123.1207,
        name: 'Coastal Haven',
        description: 'Modern waterfront loft with breathtaking views of the harbor and mountains. Floor-to-ceiling windows throughout.',
        price: 289.00,
        previewImage: true,
        avgRating: null
      },
      {
        ownerId: 4,
        address: '943 Riverside Lane',
        city: 'Austin',
        state: 'TX',
        country: 'United States',
        lat: 30.2672,
        lng: -97.7431,
        name: 'Urban Oasis',
        description: 'Stylish downtown apartment with rooftop pool access. Walking distance to live music venues and food trucks.',
        price: 195.00,
        previewImage: true,
        avgRating: 4.7
      },
      {
        ownerId: 2,
        address: '1642 Sunflower Way',
        city: 'San Diego',
        state: 'CA',
        country: 'United States',
        lat: 32.7157,
        lng: -117.1611,
        name: 'Sunset Villa',
        description: 'Beachside bungalow with private garden and outdoor shower. Perfect for surfers and beach enthusiasts.',
        price: 245.00,
        previewImage: true,
        avgRating: null
      },
      {
        ownerId: 1,
        address: '482 Mountain Vista Road',
        city: 'Denver',
        state: 'CO',
        country: 'United States',
        lat: 39.7392,
        lng: -104.9903,
        name: 'Alpine Hideaway',
        description: 'Contemporary mountain home with hot tub and stunning Rocky Mountain views. Minutes from hiking trails.',
        price: 220.00,
        previewImage: true,
        avgRating: 4.9
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: [
        'Evergreen Retreat',
        'Coastal Haven',
        'Urban Oasis',
        'Sunset Villa',
        'Alpine Hideaway',
        'Canal House Gem',
        'Tropical Paradise',
        'Urban Lakefront Loft'
      ] }
    }, {});
  }
};
