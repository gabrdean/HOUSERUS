const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, sequelize, ReviewImage} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

//SPOT CREATION VALIDATOR
const validateSpotCreation = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be within -90 and 90'),
    check('lng')
      .exists({ checkFalsy: true })
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be within -180 and 180'),
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .isFloat({ min: 0 })
      .withMessage('Price per day must be a positive number'),
    handleValidationErrors
  ];

//REVIEW VALIDATOR  
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];
  


// GET ALL SPOTS WITH FILTERS

router.get('/', async (req, res) => {
    let { 
        page,
        size,
        minLat,
        maxLat,
        minLng,
        maxLng,
        minPrice,
        maxPrice 
    } = req.query;

    // Validation errors object
    const errors = {};

    // Validate pagination
    if (page) {
        page = parseInt(page);
        if (Number.isNaN(page) || page < 1) {
            errors.page = "Page must be greater than or equal to 1";
        } else if (page > 10) {
            page = 10;
        }
    } else {
        page = 1;
    }

    if (size) {
        size = parseInt(size);
        if (Number.isNaN(size) || size < 1) {
            errors.size = "Size must be greater than or equal to 1";
        } else if (size > 20) {
            size = 20;
        }
    } else {
        size = 20;
    }

    // Validate latitude
    if (minLat !== undefined) {
        minLat = parseFloat(minLat);
        if (Number.isNaN(minLat) || minLat < -90 || minLat > 90) {
            errors.minLat = "Minimum latitude is invalid";
        }
    }
    if (maxLat !== undefined) {
        maxLat = parseFloat(maxLat);
        if (Number.isNaN(maxLat) || maxLat < -90 || maxLat > 90) {
            errors.maxLat = "Maximum latitude is invalid";
        }
    }

    // Validate longitude
    if (minLng !== undefined) {
        minLng = parseFloat(minLng);
        if (Number.isNaN(minLng) || minLng < -180 || minLng > 180) {
            errors.minLng = "Minimum longitude is invalid";
        }
    }
    if (maxLng !== undefined) {
        maxLng = parseFloat(maxLng);
        if (Number.isNaN(maxLng) || maxLng < -180 || maxLng > 180) {
            errors.maxLng = "Maximum longitude is invalid";
        }
    }

    // Validate price
    if (minPrice !== undefined) {
        minPrice = parseFloat(minPrice);
        if (Number.isNaN(minPrice) || minPrice < 0) {
            errors.minPrice = "Minimum price must be greater than or equal to 0";
        }
    }
    if (maxPrice !== undefined) {
        maxPrice = parseFloat(maxPrice);
        if (Number.isNaN(maxPrice) || maxPrice < 0) {
            errors.maxPrice = "Maximum price must be greater than or equal to 0";
        }
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors: errors
        });
    }

    try {
        // Build where clause for filters
        const where = {};

        // Add latitude filters
        if (minLat !== undefined && maxLat !== undefined) {
            where.lat = { [Op.between]: [minLat, maxLat] };
        } else if (minLat !== undefined) {
            where.lat = { [Op.gte]: minLat };
        } else if (maxLat !== undefined) {
            where.lat = { [Op.lte]: maxLat };
        }

        // Add longitude filters
        if (minLng !== undefined && maxLng !== undefined) {
            where.lng = { [Op.between]: [minLng, maxLng] };
        } else if (minLng !== undefined) {
            where.lng = { [Op.gte]: minLng };
        } else if (maxLng !== undefined) {
            where.lng = { [Op.lte]: maxLng };
        }

        // Add price filters
        if (minPrice !== undefined && maxPrice !== undefined) {
            where.price = { [Op.between]: [minPrice, maxPrice] };
        } else if (minPrice !== undefined) {
            where.price = { [Op.gte]: minPrice };
        } else if (maxPrice !== undefined) {
            where.price = { [Op.lte]: maxPrice };
        }

        // Get spots with pagination and filters
        const spots = await Spot.findAll({
            where,
            limit: size,
            offset: size * (page - 1),
            include: [{
                model: SpotImage,
                as: 'spotImages',
                attributes: ['url'],
                where: { preview: true },
                required: false
              }],
        });

 // Format the spots to ensure numeric values
 const formattedSpots = spots.map(spot => ({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: parseFloat(spot.lat),
    lng: parseFloat(spot.lng),
    name: spot.name,
    description: spot.description,
    price: parseFloat(spot.price),
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    previewImage: spot.spotImages?.[0]?.url || null,  
    avgRating: spot.avgRating ? parseFloat(spot.avgRating) : null
}));

return res.json({
    Spots: formattedSpots,
    page,
    size
});

} catch (error) {
console.error(error);
return res.status(500).json({
    message: "An error occurred while retrieving spots",
});
}
});


//POST CREATE A SPOT
router.post('/', requireAuth, validateSpotCreation, async (req, res) => {
    try {
      const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      } = req.body;
  
      const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      });
  
      return res.status(201).json({
        id: newSpot.id,
        ownerId: newSpot.ownerId,
        address: newSpot.address,
        city: newSpot.city,
        state: newSpot.state,
        country: newSpot.country,
        lat: parseFloat(newSpot.lat),
        lng: parseFloat(newSpot.lng),
        name: newSpot.name,
        description: newSpot.description,
        price: parseFloat(newSpot.price),
        createdAt: newSpot.createdAt,
        updatedAt: newSpot.updatedAt
      });
  
    } catch (error) {
      // If it's a validation error from Sequelize
      if (error.name === 'SequelizeValidationError') {
        const errors = {
          address: "Street address is required",
          lat: "Latitude is not valid",
          lng: "Longitude is not valid",
          name: "Name must be less than 50 characters",
          description: "Description is required",
          price: "Price per day is required"
        };
  
        return res.status(400).json({
          message: "Bad Request",
          errors
        });
      }
  
      // For other errors
      return res.status(500).json({
        message: "Server Error"
      });
    }
  });
  
  
  router.get('/current', requireAuth, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        
        const spots = await Spot.findAll({
            where: { ownerId: currentUserId },
            include: [{
                model: SpotImage,
                as: 'spotImages',
                attributes: ['url'],
                where: { preview: true },
                required: false
            }]
        });

        // Format the spots to ensure numeric values
        const formattedSpots = spots.map(spot => ({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: parseFloat(spot.lat),
            lng: parseFloat(spot.lng),
            name: spot.name,
            description: spot.description,
            price: parseFloat(spot.price),
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            previewImage: spot.spotImages?.[0]?.url || null,
            avgRating: spot.avgRating ? parseFloat(spot.avgRating) : null
        }));

        if (!formattedSpots.length) {
            return res.status(404).json({ message: "No spots found." });
        }

        return res.json({ Spots: formattedSpots });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
});

 
 //GET A SPOT BY ITS SPOTiD
router.get('/:spotId', async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.spotId, {
            include: [
                {
                    model: SpotImage,
                    as: 'spotImages',
                    attributes: ['id', 'url', 'preview']
                },
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        
        const reviewStats = await Review.findOne({
            where: { spotId: spot.id },
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'numReviews'],
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating']
            ],
            raw: true
        });

        const spotData = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: parseFloat(spot.lat),
            lng: parseFloat(spot.lng),
            name: spot.name,
            description: spot.description,
            price: parseFloat(spot.price),
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews: parseInt(reviewStats?.numReviews || 0),
            avgStarRating: parseFloat(reviewStats?.avgStarRating || 0),
            SpotImages: spot.spotImages || [],
            Owner: spot.owner
        };

        return res.json(spotData);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
});


//POST ADD AN IMAGE TO A SPOT
router.post('/:spotId/images', requireAuth, async (req, res) => {
    try {
        const { url, preview } = req.body;
        const spotId = req.params.spotId; //":spotId"

        // Find the spot
        const spot = await Spot.findByPk(spotId);

        // Check if spot exists
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        // Check authorization 
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        // Create the spot image
        const newImage = await SpotImage.create({
            spotId: spot.id,
            url,
            preview
        });

        //Response
        return res.status(201).json({
            id: newImage.id,
            url: newImage.url,
            preview: newImage.preview
        });

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                url: "Image URL is required",
                preview: "Preview status is required"
            }
        });
    }
});


//GET THE DETAILS OF A SPOT BY ITS SPOTiD
router.get('/:spotId', async (req, res) => {
try {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview'],
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName'],
            }
        ]
    });

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    // Get review statistics
    const reviews = await Review.findAndCountAll({
        where: { spotId: spot.id },
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'numReviews'],
            [sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating']
        ],
        raw: true
    });

    // response formatted
    const spotData = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: reviews[0].numReviews || 0,
        avgStarRating: Number(reviews[0].avgStarRating) || 0,
        SpotImages: spot.SpotImages,
        Owner: spot.Owner
    };

    return res.json(spotData);

} catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
}
});


//PUT EDIT SPOT
router.put('/:spotId', requireAuth, validateSpotCreation, async (req, res) => {
    try {
        const spotId = req.params.spotId;
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        } = req.body;

        // Find the spot
        const spot = await Spot.findByPk(spotId);

        // Check if spot exists
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        // Check authorization
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        // Update the spot
        await spot.update({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        // Format the response
        return res.json({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: parseFloat(spot.lat),
            lng: parseFloat(spot.lng),
            name: spot.name,
            description: spot.description,
            price: parseFloat(spot.price),
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt
        });

    } catch (error) {
        
        if (error.name === 'SequelizeValidationError') {
            const errors = {
                address: "Street address is required",
                lat: "Latitude is not valid",
                lng: "Longitude is not valid",
                name: "Name must be less than 50 characters",
                description: "Description is required",
                price: "Price per day is required"
            };

            return res.status(400).json({
                message: "Bad Request",
                errors
            });
        }

        // For other errors
        return res.status(500).json({
            message: "Server Error"
        });
    }
});


// DELETE A SPOT BY SPOIiD
router.delete('/:spotId', requireAuth, async (req, res) => {
    try {
        const spotId = req.params.spotId;

        // Find the spot
        const spot = await Spot.findByPk(spotId);

        // Check if spot exists
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        // Check authorization
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        // Delete the spot
        await spot.destroy();

        return res.json({
            message: "Successfully deleted"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error"
        });
    }
});

//POST A REVIEW TO A SPOT BY SPOTiD
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    try {
        const spotId = req.params.spotId;
        const userId = req.user.id;
        const { review, stars } = req.body;

        // Check if the spot exists
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        // Check if user already has a review for this spot
        const existingReview = await Review.findOne({
            where: {
                spotId: spotId,
                userId: userId
            }
        });

        if (existingReview) {
            return res.status(500).json({
                message: "User already has a review for this spot"
            });
        }

        // Create the review
        const newReview = await Review.create({
            userId,
            spotId: parseInt(spotId),
            review,
            stars
        });

        return res.status(201).json({
            id: newReview.id,
            userId: newReview.userId,
            spotId: newReview.spotId,
            review: newReview.review,
            stars: newReview.stars,
            createdAt: newReview.createdAt,
            updatedAt: newReview.updatedAt
        });

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                    review: "Review text is required",
                    stars: "Stars must be an integer from 1 to 5"
                }
            });
        }
        console.error(error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
});

//GET ALL REVIEWS BY SPOTiD
router.get('/:spotId/reviews', async (req, res) => {
    try {
        const { spotId } = req.params;

        // First check if spot exists
        const spot = await Spot.findByPk(spotId);
        
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        // Get reviews with associated data
        const reviews = await Review.findAll({
            where: {
                spotId: spotId
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    as: 'reviewImages',
                    attributes: ['id', 'url']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Format response
        const formattedReviews = reviews.map(review => ({
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: {
                id: review.user.id,
                firstName: review.user.firstName,
                lastName: review.user.lastName
            },
            ReviewImages: review.reviewImages.map(image => ({
                id: image.id,
                url: image.url
            }))
        }));

        return res.json({
            Reviews: formattedReviews
        });

    } catch (error) {
        console.error('Error in get spot reviews:', error);
        return res.status(500).json({
            message: "An error occurred while retrieving reviews"
        });
    }
});


module.exports = router;
