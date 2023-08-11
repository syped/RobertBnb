const express = require("express");
const router = express.Router();

const { SpotImage, Spot } = require("../../db/models");

const { requireAuth } = require("../../utils/auth");

// Delete a Spot Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const image = await SpotImage.findByPk(req.params.imageId);
  let userId = req.user.id;

  if (image) {
    const spot = await Spot.findOne({
      where: { id: image.spotId, ownerId: userId },
    });

    if (spot.ownerId === userId) {
      await image.destroy();
    } else {
      res.status(403);
      res.json({
        message: "Spot must belong to the current user",
      });
    }
  } else {
    res.status(404);
    res.json({
      message: "Spot Image couldn't be found",
    });
  }

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
