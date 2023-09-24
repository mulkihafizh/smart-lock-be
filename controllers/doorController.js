// const Door = require("../models/Door");
const mongoose = require("mongoose");

const doorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
      unique: true,
    },
    key: {
      type: String,
      required: true,
    },
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    isLocked: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Door = mongoose.model("Door", doorSchema);

exports.createDoor = async (req, res) => {
  try {
    const { name, key } = req.body;
    const newDoor = new Door({
      name,
      key,
    });
    const door = await Door.findOne({ name: newDoor.name });
    if (door) {
      return res.status(400).json({ error: "Door already exists" });
    }
    await newDoor.save();
    res.status(201).json({ message: "Door created successfully" });
  } catch (e) {
    res.status(500).json({ error: `An error occurred:${error}` });
  }
};

exports.getDoor = async (req, res) => {
  try {
    const door = await Door.find();
    return res.status(200).json(door);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const door = await Door.findOne({ _id: id });
    return res.status(200).json(door);
  } catch (e) {
    return res.status(500).json({ error: "Internal server errors" });
  }
};
