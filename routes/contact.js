const express = require("express");
const { Contact } = require("../models/contact");
const { User } = require("../models/user");
const router = express.Router();

// Contacts GET Request To Get The Contact List
router.get("/", async (req, res) => {
  const contactsList = await Contact.find().populate("user");

  if (!contactsList)
    return res
      .status(400)
      .json({ success: false, message: "Not found any contact!" });

  res.status(200).send(contactsList);
});

// Contacts GET Request To Get The Contact By Id
router.get("/:cid", async (req, res) => {
    const contact= await Contact.findById(req.params.cid).populate("user");

  if (!contact)
    return res
      .status(400)
      .json({ success: false, message: "Not found any contact!" });

  res.status(200).send(contact);
});

// Contact POST Request To Add A New Contact To The Contacts List
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
