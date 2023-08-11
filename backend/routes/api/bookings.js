const express = require("express");
const router = express.Router();

const { User, Booking, Spot, SpotImage } = require("../../db/models");

const { requireAuth } = require("../../utils/auth");

// Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);

  const bookings = await Booking.findAll({
    where: {
      userId: user.id,
    },
    include: [
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
    ],
  });

  let bookingsList = [];
  bookings.forEach((booking) => {
    bookingsList.push(booking.toJSON());
  });

  bookingsList.forEach((booking) => {
    booking.Spot.SpotImages.forEach((image) => {
      if (image.preview === true) {
        booking.Spot.previewImage = image.url;
      }
    });

    delete booking.Spot.SpotImages;
  });

  res.json({ Bookings: bookingsList });
});

// Edit a Booking
router.put("/:bookingId", requireAuth, async (req, res) => {
  let booking = await Booking.findByPk(req.params.bookingId);
  let user = await User.findByPk(req.user.id);

  const { startDate, endDate } = req.body;

  let newStartDate = new Date(startDate);
  let newEndDate = new Date(endDate);
  let currDate = new Date();

  if (newEndDate.getTime() <= newStartDate.getTime()) {
    res.status(400);
    return res.json({
      message: "Bad Request",
      errors: { endDate: "endDate cannot be on or before startDate" },
    });
  }

  if (booking) {
    if (booking.userId === user.id) {
      if (booking.endDate.getTime() < currDate.getTime()) {
        res.status(403);
        return res.json({ message: "Past bookings can't be modified" });
      }

      if (
        (booking.startDate >= newStartDate &&
          booking.startDate <= newEndDate) ||
        (booking.endDate >= newStartDate && booking.endDate <= newEndDate)
      ) {
        res.status(403);
        return res.json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking",
          },
        });
      }

      await booking.update({
        startDate,
        endDate,
      });
    } else {
      res.status(403);
      res.json({
        message: "Booking must belong to the current user",
      });
    }
  } else {
    res.status(404);
    res.json({
      message: "Booking couldn't be found",
    });
  }

  res.json(booking);
});

// Delete a Booking
router.delete("/:bookingId", requireAuth, async (req, res) => {
  let booking = await Booking.findByPk(req.params.bookingId);
  let userId = req.user.id;

  let spot = await Spot.findOne({
    where: {
      ownerId: userId,
    },
  });

  if (booking) {
    if (booking.userId === userId || spot.ownerId === userId) {
      let currDate = new Date();
      let newStartDate = new Date(booking.startDate);
      let newEndDate = new Date(booking.endDate);
      if (currDate > newStartDate && currDate < newEndDate) {
        res.status(403);
        res.json({
          message: "Bookings that have been started can't be deleted",
        });
      } else {
        await booking.destroy();
      }
    } else {
      res.status(403);
      res.json({
        message:
          "Booking must belong to the current user or the Spot must belong to the current user",
      });
    }
  } else {
    res.status(404);
    res.json({
      message: "Booking couldn't be found",
    });
  }

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
