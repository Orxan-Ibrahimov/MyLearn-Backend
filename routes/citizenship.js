const express = require("express");
const { Citizenship } = require("../models/citizenship");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const FILE_TYPES = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let typeError = new Error({ message: "image type was not valid!" });
    const isValid = FILE_TYPES[file.mimetype];
    if (isValid) typeError = null;
    cb(typeError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const filename = file.fieldname.replace(" ", "-");
    const extension = FILE_TYPES[file.mimetype];
    cb(null, `myimagefor${filename}${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// citizens get request for to get Citizens list
router.get("/", async (req, res) => {
  const citizens = await Citizenship.find();

  if (!citizens)
    return res
      .status(404)
      .json({ success: false, message: "not found any citizen!" });

  res.send(citizens);
});

// citizens get request for to get a Citizens for id
router.get("/:cid", async (req, res) => {
  const citizenship = await Citizenship.findById(req.params.cid);

  if (!citizenship)
    return res
      .status(404)
      .json({ success: false, message: "not found the citizenship!" });

  res.send(citizenship);
});

// citizens POST request for to create a citizen
router.post("/", uploadOptions.single("flag"), async (req, res) => {
  const file = req.file;
  if (!file)
    return res
      .status(500)
      .send({ success: false, message: "image was not sended!" });

  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let cs = new Citizenship({
    citizenship: req.body.citizenship,
    flag: `${basePath}${file.filename}`,
    // flag: req.body.flag,
  });

  cs = await cs.save();

  if (!cs)
    return res
      .status(500)
      .json({ success: false, message: "citizenship can not be added!" });

  res.status(201).send(cs);
});

// citizens PUT request for to update the citizen
router.put("/:cid", uploadOptions.single("flag"), async (req, res) => {
  // Find Old CitizenShip and Check
  const oldCitizenship = await Citizenship.findById(req.params.cid);
  if (!oldCitizenship)
    return res
      .status(500)
      .json({ success: false, message: "product was not found in database" });

  // Check Flag Image Sended Or Not
  const file = req.file;
  let newFlagImage = oldCitizenship.flag;
  if (file) {
    // Remove Flag Image Form Folder and Define New Flag Image Path
    let oldFlagImage = oldCitizenship.flag.split("/");
    oldFlagImage = oldFlagImage[oldFlagImage.length - 1];
    await fs.unlinkSync(`./public/uploads/${oldFlagImage}`, (err) => {
      if (err) res.status(500).json({ success: false, message: err });
    });

    newFlagImage = `${req.protocol}://${req.get("host")}/public/uploads/${
      file.filename
    }`;
  }

  // Update CitiZen
  let citizenship = await Citizenship.findByIdAndUpdate(
    req.params.cid,
    {
      citizenship: req.body.citizenship,
      flag: newFlagImage,
    },
    {
      new: true,
    }
  );

  if (!citizenship)
    return res
      .status(500)
      .json({ success: false, message: "citizenship can not be updated!" });

  res.status(201).send(citizenship);
});

// citizens DELETE request for to remove the Citizen for id
router.delete("/:cid", async (req, res) => {
  const citizenship = Citizenship.findByIdAndDelete(req.params.cid)
    .then((cs) => {
      let flagImage = cs.flag.split("/");
      flagImage = flagImage[flagImage.length - 1];
      if (!cs)
        return res
          .status(404)
          .json({ success: false, message: "citizenship can not be deleted!" });

      fs.unlink(`./public/uploads/${flagImage}`, (err) => {
        if (err) throw err;
        console.log("path/file.txt was deleted");
      });

      res.send(citizenship);
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
});

module.exports = router;