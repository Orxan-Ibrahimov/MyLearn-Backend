const express = require("express");
const { Review } = require("../models/review");
const { User } = require("../models/user");
const router = express.Router();

// Reviews GET Request To Get The Reviews List
router.get("/", async (req, res) => {
  const reviewsList = await Review.find();

  if (!reviewsList)
    return res
      .status(404)
      .json({ success: false, message: "Not found any review!" });

  res.status(200).send(reviewsList);
});

// Reviews GET Request To Get The Review By Id
router.get("/:rid", async (req, res) => {
  const review = await Review.findById(req.params.rid);

  if (!review)
    return res
      .status(404)
      .json({ success: false, message: "The review not found!" });

  res.status(200).send(review);
});

// Reviews POST Request To Add A New Review To The Reviews List
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
router.delete("/:rid", async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.rid)
    .then(async (removedReview) => {
      if (!removedReview)
        return res
          .status(500)
          .json({ success: false, message: "The review can not be deleted!" });

      user = await User.findById(removedReview.user);
      if (user) {
        if (user.reviews.includes(removedReview.id)) {
          user.reviews.splice(removedReview.id);
          user = await user.save();
        }
      }
      res.status(200).send(removedReview);
    })
    .catch((err) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
    });
});

module.exports = router;
