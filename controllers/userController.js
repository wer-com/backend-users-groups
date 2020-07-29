const User = require("../models/User");
const Group = require("../models/Group");

exports.getUsers = async (req, res) => {
  const users = await User.find({});
  if (!users) {
    return res.status(404).send({ error: "couldn't find any users" });
  }

  return res.status(200).send({ users });
};

exports.addUser = async (req, res) => {
  const { body } = req;
  const checkIfUsernameExist = await User.findOne({ username: body.username });

  if (checkIfUsernameExist) {
    return res
      .status(409)
      .send({ error: "user with that username already exist" });
  }

  const user = new User({ ...body });

  try {
    await user.save();

    return res.status(201).send({ user });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res.status(error.statusCode).send({ error: error.message });
  }
};

exports.editUser = async (req, res) => {
  const { userId } = req.params;
  const { body } = req;

  try {
    const user = await User.findOneAndUpdate({ _id: userId }, { ...body });
    return res.status(201).send(user);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    user.remove();
    return res.status(204).send({ message: "user removed" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("groups");
    return res.status(200).send(user);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res.status(error.statusCode).send({ error: error.message });
  }
};
