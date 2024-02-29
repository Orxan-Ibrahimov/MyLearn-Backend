const express = require("express");
const { RatingDetails } = require("../models/rating-details");
const router = express.Router();

// rating details GET request for to get all rating details list
router.get("/", async (req, res) => {
  const ratingDetailsList = await RatingDetails.find();

  if (!ratingDetailsList)
    return res
      .status(404)
      .json({ success: false, message: "not found any ratingDetails!" });

  res.status(200).send(ratingDetailsList);
});

// rating details GET request for to get any rating details for ID
router.get("/:rid", async (req, res) => {
  const ratingDetails = await RatingDetails.findById(req.params.rid);

  if (!ratingDetails)
    return res
      .status(404)
      .json({ success: false, message: "The ratingDetails not found!" });

  res.status(200).send(ratingDetails);
});

// rating details POST request for to get a new rating details
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

// rating details DELETE request for to remove any rating details for ID
router.put("/:rid", async (req, res) => {
  const ratingDetails = await RatingDetails.findByIdAndUpdate(
    req.params.rid,
    {
      point: req.body.point,
      colour: req.body.colour,
      idea: req.body.idea,
      actionDate: req.body.actionDate,
    },
    { new: true }
  );

  if (!ratingDetails)
    return res
      .status(404)
      .json({ success: false, message: "The ratingDetails can not updated!" });

  res.status(200).send(ratingDetails);
});

// rating details DELETE request for to remove any rating details for ID
router.delete("/:rid", async (req, res) => {
  const ratingDetails = await RatingDetails.findByIdAndDelete(req.params.rid);

  if (!ratingDetails)
    return res
      .status(404)
      .json({ success: false, message: "The ratingDetails can not removed!" });

  res.status(200).send(ratingDetails);
});

module.exports = router;
