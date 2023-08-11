const express = require("express");
const router = express.Router();

const {
  User,
  Review,
  Spot,
  SpotImage,
  ReviewImage,
} = require("../../db/models");

const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

router.get("/current", requireAuth, async (req, res) => {
  let user = await User.findByPk(req.user.id);

  let reviews = await Review.findAll({
    where: {
      userId: user.id,
    },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      {
        model: Spot,
        include: [{ model: SpotImage }],
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
      },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
  });

  let reviewsList = [];
  reviews.forEach((review) => {
    reviewsList.push(review.toJSON());
  });

  reviewsList.forEach((review) => {
    review.Spot.SpotImages.forEach((image) => {
      if (image.preview === true) {
        review.Spot.previewImage = image.url;
      }
    });

    delete review.Spot.SpotImages;
  });

  res.json({ Reviews: reviewsList });
});

router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId, {
    include: [{ model: ReviewImage }],
  });
  const user = await User.findByPk(req.user.id);

  if (review) {
    if (review.userId === user.id) {
      const { url } = req.body;

      console.log(review);
      if (review.ReviewImages.length < 10) {
        const reviewImage = await ReviewImage.create({
          reviewId: review.id,
          url,
        });

        return res.json({
          id: reviewImage.id,
          url: reviewImage.url,
        });
      } else {
        res.status(403);
        res.json({
          message: "Maximum number of images for this resource was reached",
        });
      }
    } else {
      res.status(403);
      res.json({
        message: "Review must belong to the current user",
      });
    }
  } else {
    res.status(404);
    res.json({
      message: "Review couldn't be found",
    });
  }
});

router.put("/:reviewId", requireAuth, validateReview, async (req, res) => {
  let currentReview = await Review.findByPk(req.params.reviewId);
  let user = await User.findByPk(req.user.id);

  if (currentReview) {
    if (currentReview.userId === user.id) {
      const { review, stars } = req.body;

      await currentReview.update({
        review,
        stars,
      });
    } else {
      res.status(403);
      res.json({
        message: "Review must belong to the current user",
      });
    }
  } else {
    res.status(404);
    res.json({
      message: "Review couldn't be found",
    });
  }

  res.json(currentReview);
});

router.delete("/:reviewId", requireAuth, async (req, res) => {
  let review = await Review.findByPk(req.params.reviewId);
  let userId = req.user.id;

  if (review) {
    if (review.userId === userId) {
      await review.destroy();
    } else {
      res.status(403);
      res.json({
        message: "Review must belong to the current user",
      });
    }
  } else {
    res.status(404);
    res.json({
      message: "Review couldn't be found",
    });
  }

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
