const express = require("express");
const { Contact } = require("../models/contact");
const { User } = require("../models/user");
const router = express.Router();

router.get("/", async (req, res) => {});
router.get("/:cid", async (req, res) => {});
router.post("/", async (req, res) => {
  let dbUser = await User.findById(req.body.user);
  if (!dbUser)
    return res
      .status(404)
      .json({ success: false, message: "The user was not at database!" });

  let contact = new Contact({
    message: req.body.message,
    user: req.body.user,
  });

  if (!contact)
    return res
      .status(400)
      .json({ success: false, message: "The contact can not be added!" });

  contact = await contact.save();

  res.status(201).send(contact);
});
router.put("/", async (req, res) => {});
router.delete("/", async (req, res) => {});

module.exports = router;
