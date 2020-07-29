const Group = require("../models/Group");
const User = require("../models/User");

exports.getGroups = async (req, res) => {
  const groups = await Group.find({});
  if (!groups) {
    return res.status(404).send({ error: "couldn't find any groups" });
  }

  return res.status(200).send({ groups });
};

exports.addGroup = async (req, res) => {
  const { body } = req;

  const checkIfGroupExist = await Group.findOne({ name: body.name });

  if (checkIfGroupExist) {
    return res
      .status(409)
      .send({ error: "group with that name already exist" });
  }

  const group = new Group({ ...body });

  try {
    await group.save();

    return res.status(201).send({ group });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res.status(error.statusCode).send({ error: error.message });
  }
};

exports.editGroup = async (req, res) => {
  const { groupId } = req.params;
  const { body } = req;

  try {
    const group = await Group.findOneAndUpdate({ _id: groupId }, { ...body });
    return res.status(201).send(group);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    group.remove();
    return res.status(204).send({ message: "group removed" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.addUserToGroup = async (req, res) => {
  const { groupId, userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ error: "Couldn't find user" });
  }
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).send({ error: "Couldn't find group" });
  }

  const isInArray = user.groups.some(function (friend) {
    return friend.equals(group.id);
  });

  if (isInArray) {
    return res.status(409).send({ error: "user is already in that group" });
  }

  try {
    await user.groups.push(group);
    await user.save();
    await group.users.push(user);
    await group.save();
    return res.status(201).send({ group: group, user: user });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res.status(error.statusCode).send({ error: error.message });
  }
};

exports.removeUserFromGroup = async (req, res) => {
  const { groupId, userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ error: "Couldn't find user" });
  }
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).send({ error: "Couldn't find group" });
  }

  try {
    await group.users.pull(userId);
    await group.save();
    await user.groups.pull(groupId);
    await user.save();
    return res.status(202).send({ message: "Success", user: { id: userId } });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res.status(error.statusCode).send({ error: error.message });
  }
};

exports.getGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate("users");

    return res.status(200).send(group);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res.status(error.statusCode).send({ error: error.message });
  }
};
