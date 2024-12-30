const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { ReviewImage, Review } = require('../../db/models');

// DELETE /api/review-images/:imageId
router.delete('/:imageId', requireAuth, async (req, res) => {
    try {
        const imageId = req.params.imageId;

        // Find the review image
        const reviewImage = await ReviewImage.findByPk(imageId);

        // Check if the image exists
        if (!reviewImage) {
            return res.status(404).json({
                message: "Review Image couldn't be found"
            });
        }

        // Find the associated review
        const review = await Review.findByPk(reviewImage.reviewId);

        // Check if the review exists and belongs to the current user
        if (!review || review.userId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        // Delete the image
        await reviewImage.destroy();

        return res.json({
            message: "Successfully deleted"
        });

    } catch (error) {
        console.error(error);
        // Return 403 for authorization err, 500 for other err
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
        return res.status(500).json({
            message: "Server Error"
        });
    }
});

module.exports = router;