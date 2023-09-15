const express = require("express");
const {
  createDoor,
  getDoor,
  getOne,
} = require("../controllers/doorController");
const { check } = require("express-validator");
const router = express.Router();

router.post("/door/create", createDoor);
router.get("/door/get", getDoor);
router.get("/door/get/:id", getOne);

module.exports = router;