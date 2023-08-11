const express = require("express");
const router = express.Router();

const {
  Spot,
  SpotImage,
  User,
  Review,
  ReviewImage,
  Booking,
} = require("../../db/models");

const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const { Op } = require("sequelize");

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .isNumeric()
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

const validateQuery = [
  check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),
  check("maxLat")
    .optional()
    .isInt({ min: -90, max: 90 })
    .withMessage("Maximum latitude is invalid"),
  check("minLat")
    .optional()
    .isInt({ min: -90, max: 90 })
    .withMessage("Minimum latitude is invalid"),
  check("maxLng")
    .optional()
    .isInt({ min: -180, max: 180 })
    .withMessage("Maximum longitude is invalid"),
  check("minLat")
    .optional()
    .isInt({ min: -180, max: 180 })
    .withMessage("Minimum longitude is invalid"),
  check("minPrice")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];

// Query filters to Get All Spots
router.get("/", validateQuery, async (req, res) => {
  let { page, size } = req.query;

  if (!page || page > 10 || isNaN(page)) page = 1;
  if (!size || size > 20 || isNaN(size)) size = 20;

  let pagination = { limit: size, offset: size * (page - 1) };

  let where = {};

  let { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  if (minLat) {
    where.lat = {
      [Op.gte]: minLat,
    };
  }

  if (maxLat) {
    where.lat = {
      [Op.lte]: maxLat,
    };
  }

  if (minLng) {
    where.lng = {
      [Op.gte]: minLng,
    };
  }

  if (maxLng) {
    where.lng = {
      [Op.lte]: maxLng,
    };
  }

  if (minPrice) {
    where.price = {
      [Op.gte]: minPrice,
    };
  }

  if (maxPrice) {
    where.price = {
      [Op.lte]: maxPrice,
    };
  }

  const spots = await Spot.findAll({
    include: [{ model: Review }, { model: SpotImage }],
    where,
    ...pagination,
  });

  spotsList = [];
  spots.forEach((spot) => {
    spotsList.push(spot.toJSON());
  });

  spotsList.forEach((spot) => {
    spot.SpotImages.forEach((image) => {
      if (image.preview === true) {
        spot.previewImage = image.url;
      }
    });
    if (!spot.previewImage) {
      spot.previewImage = "no preview image found";
    }

    delete spot.SpotImages;

    spot.Reviews.forEach((review) => {
      let sum = 0;
      let count = 0;

      if (review) {
        sum += review.stars;
        count++;
      }
      let avg = sum / count;
      spot.avgRating = avg;
    });
    if (!spot.avgRating) {
      spot.avgRating = 0;
    }

    delete spot.Reviews;
  });

  let result = { Spots: spotsList };

  if (page == 0) result.page = 1;
  else result.page = parseInt(page);

  result.size = parseInt(size);

  res.json(result);
});

// router.get("/", async (req, res) => {
//   const spots = await Spot.findAll({
//     include: [{ model: Review }, { model: SpotImage }],
//   });

//   spotsList = [];
//   spots.forEach((spot) => {
//     spotsList.push(spot.toJSON());
//   });

//   spotsList.forEach((spot) => {
//     spot.SpotImages.forEach((image) => {
//       if (image.preview === true) {
//         spot.previewImage = image.url;
//       }
//     });
//     if (!spot.previewImage) {
//       spot.previewImage = "no preview image found";
//     }

//     delete spot.SpotImages;

//     spot.Reviews.forEach((review) => {
//       let sum = 0;
//       let count = 0;

//       if (review) {
//         sum += review.stars;
//         count++;
//       }
//       let avg = sum / count;
//       spot.avgRating = avg;
//     });
//     if (!spot.avgRating) {
//       spot.avgRating = 0;
//     }

//     delete spot.Reviews;
//   });
//   res.json(spotsList);
// });

// Create a Spot
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const spot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.status(201);
  return res.json(spot);
});

// Create an Image for a Spot
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const user = await User.findByPk(req.user.id);

  if (spot) {
    if (spot.ownerId === user.id) {
      const { url, preview } = req.body;

      const spotImage = await SpotImage.create({
        spotId: spot.id,
        url,
        preview,
      });

      return res.json({
        id: spotImage.id,
        url: spotImage.url,
        preview: spotImage.preview,
      });
    } else {
      res.status(403);
      res.json({
        message: "Spot must belong to the current user",
      });
    }
  } else {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
    });
  }
});

// Get Spots of Current User
router.get("/current", async (req, res) => {
  let user = await User.findByPk(req.user.id);

  if (user) {
    let spots = await Spot.findAll({
      raw: true,
      where: {
        ownerId: user.id,
      },
    });

    for (let i = 0; i < spots.length; i++) {
      let reviewCount = await Review.count({
        where: {
          spotId: spots[i].id,
        },
      });

      let starSum = await Review.sum("stars", {
        where: {
          spotId: spots[i].id,
        },
      });

      let image = await SpotImage.findOne({
        raw: true,
        where: {
          spotId: spots[i].id,
        },
      });

      let avgRating;

      if (starSum === null) avgRating = 0;
      else avgRating = starSum / reviewCount;

      spots[i].avgRating = avgRating;

      if (image !== null) spots[i].previewImage = image.url;
      else spots[i].previewImage = "none";
    }

    res.json({ Spots: spots });
  }
});

// Get Details of a Spot by Id
router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      { model: Review },
      { model: SpotImage, attributes: ["id", "url", "preview"] },
      { model: User, as: "Owner", attributes: ["id", "firstName", "lastName"] },
    ],
  });

  if (spot) {
    let reviewcounter = 0;
    let totalStars = 0;

    spot.Reviews.forEach((review) => {
      reviewcounter++;
      totalStars += review.stars;
    });

    spot.dataValues.numReviews = reviewcounter;
    spot.dataValues.avgRating = totalStars / reviewcounter;

    delete spot.dataValues.Reviews;

    res.json(spot);
  } else {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
    });
  }
});

// Edit a Spot
router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {
  let spot = await Spot.findByPk(req.params.spotId);
  let userId = req.user.id;

  if (spot) {
    if (spot.ownerId === userId) {
      const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      } = req.body;

      await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      });
    } else {
      res.status(403);
      res.json({
        message: "Spot must belong to the current user",
      });
    }
  } else {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
    });
  }

  res.json(spot);
});

// Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  let spot = await Spot.findByPk(req.params.spotId);
  let userId = req.user.id;

  if (spot) {
    if (spot.ownerId === userId) {
      await spot.destroy();
    } else {
      res.status(403);
      res.json({
        message: "Spot must belong to the current user",
      });
    }
  } else {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
    });
  }

  res.json({ message: "Successfully deleted" });
});

// Get all reviews by a Spot's id
router.get("/:spotId/reviews", async (req, res) => {
  let spot = await Spot.findByPk(req.params.spotId);

  if (spot) {
    let reviews = await Review.findAll({
      where: {
        spotId: spot.id,
      },
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        { model: ReviewImage, attributes: ["id", "url"] },
      ],
    });

    res.json({ Reviews: reviews });
  } else {
    res.status(404);
    res.json({ message: "Spot couldn't be found" });
  }
});

// Create a Review for a Spot based on the Spot's id
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    const { review, stars } = req.body;

    if (spot) {
      const reviewCheck = await Review.findOne({
        where: {
          userId: req.user.id,
          spotId: spot.id,
        },
      });

      if (!reviewCheck) {
        const newReview = await Review.create({
          userId: req.user.id,
          spotId: spot.id,
          review,
          stars,
        });

        res.status(201);
        return res.json(newReview);
      } else {
        res.status(500);
        res.json({ message: "User already has a review for this spot" });
      }
    } else {
      res.status(404);
      res.json({ message: "Spot couldn't be found" });
    }
  }
);

// Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  const spot = await Spot.findByPk(req.params.spotId);

  if (spot) {
    if (user.id === spot.ownerId) {
      const ownerBookings = await Booking.findAll({
        where: {
          spotId: spot.id,
        },
        include: [{ model: User, attributes: ["id", "firstName", "lastName"] }],
      });

      res.json({ Bookings: ownerBookings });
    } else {
      const notOwnerBookings = await Booking.findAll({
        where: {
          spotId: spot.id,
        },
        attributes: ["spotId", "startDate", "endDate"],
      });

      res.json({ Bookings: notOwnerBookings });
    }
  } else {
    res.status(404);
    res.json({ message: "Spot couldn't be found" });
  }
});

// Create a Booking from a Spot based on the Spot's id
router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const user = await User.findByPk(req.user.id);
  const { startDate, endDate } = req.body;

  let newStartDate = new Date(startDate);
  let newEndDate = new Date(endDate);

  if (newEndDate.getTime() <= newStartDate.getTime()) {
    res.status(400);
    res.json({
      message: "Bad Request",
      errors: { endDate: "endDate cannot be on or before startDate" },
    });
  }

  if (spot) {
    if (user.id !== spot.ownerId) {
      const booking = await Booking.findOne({
        where: {
          spotId: spot.id,
          [Op.or]: [
            {
              startDate: {
                [Op.between]: [newStartDate, newEndDate],
              },
            },
            {
              endDate: {
                [Op.between]: [newStartDate, newEndDate],
              },
            },
          ],
        },
      });

      if (booking) {
        res.status(403);
        res.json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking",
          },
        });
      } else {
        const newBooking = await Booking.create({
          spotId: spot.id,
          userId: user.id,
          startDate,
          endDate,
        });

        res.json(newBooking);
      }
    } else {
      res.status(403);
      res.json({ message: "Spot must NOT belong to the current user" });
    }
  } else {
    res.status(404);
    res.json({ message: "Spot couldn't be found" });
  }
});

module.exports = router;
