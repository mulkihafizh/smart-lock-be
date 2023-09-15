const express = require("express");
const {
  signUp,
  signIn,
  signOut,
  getUser,
} = require("../controllers/userController");
const { check } = require("express-validator");
const router = express.Router();

router.post(
  "/user/signup",
  [
    check("username", "Username should be at least 3 char").isLength({
      min: 3,
    }),
    check("email", "Email must be a valid email").isEmail(),
    check("password", "Password should be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  signUp
);

router.post(
  "/user/signin",
  [
    check("email", "Email must be a valid email").isEmail(),
    check("password", "Password should be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  signIn
);

router.get("/user/signout", signOut);
router.get("/user/getUser", getUser);
module.exports = router;
