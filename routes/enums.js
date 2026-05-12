// routes/enums.js

const express = require("express");
const { Roles } = require("../helpers/enums/role");
const { Genders } = require("../helpers/enums/gender");
const router = express.Router();

router.get("/roles", (req, res) => {
    const roles = Object.values(Roles);

  res.json(roles);
});

router.get("/genders", (req, res) => {
    const genders = Object.values(Genders);

  res.json(genders);
});

module.exports = router;