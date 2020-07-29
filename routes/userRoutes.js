const express = require("express");
const {
  getUsers,
  editUser,
  deleteUser,
  addUser,
  getUser,
} = require("../controllers/userController");
const { body } = require("express-validator");

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:userId", getUser);
router.post(
  "/users",
  [
    body("username").trim().isLength({ min: 7 }),
    body("password").isLength({ min: 7 }),
  ],
  addUser
);
router.put("/users/:userId", editUser);
router.delete("/users/:userId", deleteUser);

module.exports = router;
