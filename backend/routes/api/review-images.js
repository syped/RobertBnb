const express = require("express");
const router = express.Router();

const { ReviewImage, Review } = require("../../db/models");

const { requireAuth } = require("../../utils/auth");

// Delete a Review Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const image = await ReviewImage.findByPk(req.params.imageId);
  let userId = req.user.id;

  if (image) {
    const review = await Review.findOne({
      where: { id: image.reviewId, userId: userId },
    });

    if (review.userId === userId) {
      await image.destroy();
    } else {
      res.status(403);
      res.json({
        message: "Review must belong to the current user",
      });
    }
  } else {
    res.status(404);
    res.json({
      message: "Review Image couldn't be found",
    });
  }

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
