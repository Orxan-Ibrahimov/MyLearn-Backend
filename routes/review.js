const express = require("express");
const { Review } = require("../models/review");
const { User } = require("../models/user");
const router = express.Router();

router.get("/", async (req, res) => {});
router.get("/:rid", async (req, res) => {});
router.post("/", async (req, res) => {
  let dbUser = await User.findById(req.body.user);
  if (!dbUser)
    return res
      .status(404)
      .json({ success: false, message: "The user was not at database!" });

  let review = new Review({
    review: req.body.review,
    user: req.body.user,
    ratingDetails: req.body.ratingDetails,
  });

  if (!review)
    return res
      .status(400)
      .json({ success: false, message: "The review can not be added!" });

  review = await review.save();

  if (!dbUser.reviews.includes(review)) {
    dbUser.reviews.push(review);
    dbUser = await dbUser.save();
  }

  res.status(201).send(review);
});
router.put("/:rid", async (req, res) => {});
router.delete("/:rid", async (req, res) => {});

module.exports = router;
