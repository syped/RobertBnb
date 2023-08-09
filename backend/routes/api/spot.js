const express = require("express");
const router = express.Router();

const { Spot, SpotImage, User, Review } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");

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

router.get("/", async (req, res) => {
  const spots = await Spot.findAll({
    include: [{ model: Review }, { model: SpotImage }],
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

    delete spot.Reviews;
  });
  res.json(spotsList);
});

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

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const user = await User.findByPk(req.user.id);

  if (spot) {
    if (spot.ownerId === user.id) {
      const { url, preview } = req.body;

      const spotImage = await SpotImage.create({
        spotId: req.params.spotId,
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

router.get("/current", requireAuth, async (req, res) => {
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

module.exports = router;
