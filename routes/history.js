const express = require("express");
const {
  getHistory,
  createHistory,
} = require("../controllers/historyController");
const { check } = require("express-validator");
const router = express.Router();

router.get("/history/get/:id", getHistory);

router.post("/history/create", createHistory);

module.exports = router;
