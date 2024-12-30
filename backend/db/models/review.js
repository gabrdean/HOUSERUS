'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // A review belongs to a spot 1 - many
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        as: 'spot'
      });

      // A review is written by a user 1-1
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // A review can have multiple review images 1 - many
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        as: 'reviewImages'
      });
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spots',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    review: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
