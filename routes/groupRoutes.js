const express = require("express");
const {
  getGroups,
  addGroup,
  editGroup,
  deleteGroup,
  addUserToGroup,
  removeUserFromGroup,
  getGroup,
} = require("../controllers/groupController");

const router = express.Router();

router.get("/groups", getGroups);
router.get("/groups/:groupId", getGroup);
router.post("/groups", addGroup);
router.put("/groups/:groupId", editGroup);
router.delete("/groups/:groupId", deleteGroup);
router.post("/groups/:groupId/users/:userId", addUserToGroup);
router.delete("/groups/:groupId/users/:userId", removeUserFromGroup);

module.exports = router;
