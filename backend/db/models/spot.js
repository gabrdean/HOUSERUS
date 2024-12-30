'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {

      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'owner'  
      });
  
    
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        as: 'reviews'  
      });
  
     
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        as: 'bookings'  
      });
  
  
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        as: 'spotImages'  
      });
    
      // define association here
    }
  }
  Spot.init({
    
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
   
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Street address is required"
        }
      }
    },
  
    city: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notNull: {
          msg: 'City is required'
        }
      }
    },
  
    state: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notNull: {
          msg: 'State is required'
        }
      }
    },
  
    country: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notNull: {
          msg: 'Country is required'
        }
      }
    },
  
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isWithinRange(value) {
          if (value < -90 || value > 90) {
            throw new Error('Latitude must be within -90 and 90');
          }
        }
      }
    },
  
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false, 
      validate: {
        isWithinRange(value) {
          if (value < -180 || value > 180) {
            throw new Error('Longitude must be within -180 and 180');
          }
        }
      }
    },
  
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 50], 
          msg: 'Name must be less than 50 characters'
        }
      }
    },
  
    description: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notNull: { msg: 'Description is required'}
      }
    },
  
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Price must be greater than or equal to 0'
        },
        notNull: {
          msg: 'Price is required'
        }
      }
    }, previewImage: {
      type: DataTypes.BOOLEAN, 
      allowNull: true, 
    },
    avgRating: {
      type: DataTypes.DECIMAL,
      allowNull: true, 
      validate: {
        isDecimal: {
          msg: 'Average rating must be a decimal value'
        },
        min: {
          args: [0],
          msg: 'Average rating must be at least 0'
        },
        max: {
          args: [5],
          msg: 'Average rating must be at most 5'
        }
      }
    }
    
    
    
  },{
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};