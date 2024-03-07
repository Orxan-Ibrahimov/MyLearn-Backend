const express = require("express");
const { Order } = require("../models/order");
const { User } = require("../models/user");
const { Playlist } = require("../models/playlist");
const router = express.Router();

// Orders GET Request To Get The Orders List
router.get("/", async (req, res) => {
  const ordersList = await Order.find().populate(["subscriber", "course"]);

  if(!ordersList) return res.status(400).json({success: false, message: "Not found any order!"});

  res.status(200).send(ordersList);
});

// Orders GET Request To Get The Order By Id
router.get("/:oid", async (req, res) => {
  const order = await Order.findById(req.params.oid).populate(["subscriber", "course"]);

  if(!order) return res.status(400).json({success: false, message: "The order not found!"});

  res.status(200).send(order);
});

// Orders POST Request To Add The Order To The Orders List
router.post("/", async (req, res) => {
  let order = new Order({
    subscriber: req.body.subscriber,
    course: req.body.course,
  });

  order = await order.save();

  if (!order)
    return res
      .status(400)
      .json({ success: false, message: "The education can not be created!" });

  // Add education to the subscriber's educations list
  let subscriber = await User.findById(order.subscriber);
  if (!subscriber)
    return res
      .status(400)
      .json({ success: false, message: "This user was not Database!" });

  if (!subscriber.orders.includes(order))
    subscriber.orders.push(order);
  subscriber = await subscriber.save();

  // Add education to the course's educations list
  let course = await Playlist.findById(order.course);
  if (!course)
    return res
      .status(400)
      .json({ success: false, message: "This course was not Database!" });

  if (!course.orders.includes(order))
  course.orders.push(order);
  course = await course.save();
  res.status(201).send(order);
});

// router.delete("/:eid", async (req, res) => {});

module.exports = router;
