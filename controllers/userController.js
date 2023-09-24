const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
      allowed: ["user", "admin"],
    },
    encrypted_password: {
      type: String,
      required: true,
    },
    salt: String,
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = crypto.randomBytes(16).toString("hex");
    this.encrypted_password = this.securePassword(password);
  })
  .get(function (password) {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encrypted_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return err;
    }
  },
};

const User = mongoose.model("User", userSchema);

exports.signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  try {
    const { username, email, password } = req.body;
    const newUser = new User({
      username,
      email,
      password,
      role: "user",
    });
    const user = await User.findOne({ username: newUser.username });

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const userem = await User.findOne({ email: newUser.email });
    if (userem) {
      return res.status(400).json({ error: "Email already exists" });
    }

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: `An error occurred:${error}` });
  }
};

exports.getUser = async (req, res) => {
  const token = req.headers.authorization;

  try {
    const userId = jwt.verify(token, process.env.SECRET)._id;
    const user = await User.findOne({
      _id: userId,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }
    if (!user.authenticate(password)) {
      return res
        .status(401)
        .json({ error: "Email and password does not match" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    try {
      res.cookie("token", token, {
        maxAge: 3600000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Error setting Cookies" });
    }
    const { _id, username } = user;
    return res.json({
      token,
      user: { _id, username, email },
      message: "Login success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.signOut = (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({
      success: "Logout success",
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
