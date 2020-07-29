const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
    trim: true,
  },
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "groups",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  const Group = require("./Group");
  Group.updateMany(
    { users: this },
    { $pull: { users: this._id } },
    { multi: true }
  ).exec(next);
});

module.exports = model("users", userSchema);
