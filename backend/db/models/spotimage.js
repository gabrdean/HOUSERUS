'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      // A SpotImage belongs to a Spot (many-to-one relationship)
      SpotImage.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        as: 'spot',
      });
    }
  }
  SpotImage.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spots',
        key: 'id',
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true, 
      },
    },
    preview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default is false, assuming preview image isn't selected by default
    },
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};
