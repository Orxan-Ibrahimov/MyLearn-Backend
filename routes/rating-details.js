const express = require("express");
const { RatingDetails } = require("../models/rating-details");
const router = express.Router();

router.post("/", async (req, res) => {
  let ratingDetails = new RatingDetails({
    point: req.body.point,
    colour: req.body.colour,
    idea: req.body.idea,
    actionDate: req.body.actionDate,
  });

  ratingDetails = await ratingDetails.save();

  if (!ratingDetails)
    return res
      .status(500)
      .json({ success: false, message: "ratingDetails can not be added!" });

  res.status(201).send(ratingDetails);
});

module.exports = router;
