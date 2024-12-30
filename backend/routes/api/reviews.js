const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Review, User, Spot, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

  // GET all Reviews of the Current User
  router.get('/current', requireAuth, async (req, res) => {
      try {
          const reviews = await Review.findAll({
              where: {
                  userId: req.user.id
              },
              include: [
                  {
                      model: User,
                      as: 'user',
                      attributes: ['id', 'firstName', 'lastName']
                  },
                  {
                      model: Spot,
                      as: 'spot',
                      attributes: [
                          'id', 
                          'ownerId', 
                          'address', 
                          'city', 
                          'state', 
                          'country', 
                          'lat', 
                          'lng', 
                          'name', 
                          'price',
                          'previewImage'
                      ]
                  },
                  {
                      model: ReviewImage,
                      as: 'reviewImages',
                      attributes: ['id', 'url']
                  }
              ]
          });
  
          //Match API SPECCCS
          const ApiformattedReviews = reviews.map(review => ({
              id: review.id,
              userId: review.userId,
              spotId: review.spotId,
              review: review.review,
              stars: review.stars,
              createdAt: review.createdAt,
              updatedAt: review.updatedAt,
              User: review.user,
              Spot: review.spot,
              ReviewImages: review.reviewImages
          }));
  
          return res.json({
              Reviews: ApiformattedReviews
          });
  
      } catch (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server Error' });
      }
  });


//POST ADD AN IMAGE TO REVIEW BY REVIEW ID
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const { url } = req.body;

        // Find the review
        const review = await Review.findByPk(reviewId);

        // Check if review exists
        if (!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            });
        }

        // Check if the review belongs to the current user
        if (review.userId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        // Check maximum number of images
        const imageCount = await ReviewImage.count({
            where: { reviewId: reviewId }
        });

        if (imageCount >= 10) {
            return res.status(403).json({
                message: "Maximum number of images for this resource was reached"
            });
        }

        // Create the review image
        const newImage = await ReviewImage.create({
            reviewId: reviewId,
            url: url
        });

        // Return formatted response
        return res.status(201).json({
            id: newImage.id,
            url: newImage.url
        });

    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                url: "Image URL is required"
            }
        });
    }
});




// PUT EDIT A REVIEW
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const { review: reviewText, stars } = req.body;

        // Find 
        const review = await Review.findByPk(reviewId);

        // Check if review exists
        if (!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            });
        }

        // authorization 
        if (review.userId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        // Update
        await review.update({
            review: reviewText,
            stars
        });

        // response
        return res.json({
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt
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



// DELETE A REVIEW
router.delete('/:reviewId', requireAuth, async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        // Find the review
        const review = await Review.findByPk(reviewId);

        // Check if review exists
        if (!review) {
            return res.status(404).json({
                message: "Review couldn't be found"
            });
        }

        // Check authorization (review must belong to current user)
        if (review.userId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        // Delete the review
        await review.destroy();

        return res.json({
            message: "Successfully deleted"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
});
  
  module.exports = router;