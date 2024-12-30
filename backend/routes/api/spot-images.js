const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { SpotImage, Spot } = require('../../db/models');

// DELETE /api/spot-images/:imageId

// DELETE /api/spot-images/:imageId
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    try {
        const imageId = req.params.imageId;

        // Find the spot image
        const spotImage = await SpotImage.findByPk(imageId);

        // image exists?
        if (!spotImage) {
            return res.status(404).json({
                message: "Spot Image couldn't be found"
            });
        }

        // Find the spot to check ownership
        const spot = await Spot.findByPk(spotImage.spotId);

        // Check if the user owns the spot
        if (!spot || spot.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        // Delete the image
        await spotImage.destroy();

        return res.json({
            message: "Successfully deleted"
        });

    } catch (err) {
        
        next(err);
    }
});



module.exports = router;