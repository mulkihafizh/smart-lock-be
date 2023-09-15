const History = require("../models/history");

exports.getHistory = async (req, res) => {
  try {
    const id = req.params.id;
    const history = await History.find({ _doorId: id });
    return res.status(200).json(history);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.createHistory = async (req, res) => {
  try {
    const { name, date, _doorId } = req.body;
    const newHistory = new History({
      name,
      date,
      _doorId,
    });
    const history = await History.findOne({ name: newHistory.name });
    if (history) {
      return res.status(400).json({ error: "History already exists" });
    }
    await newHistory.save();
    return res.status(201).json({ message: "History created successfully" });
  } catch (e) {
    return res.status(500).json({ error: `An error occurred:${e}` });
  }
};
