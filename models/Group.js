const { Schema, model } = require("mongoose");

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

groupSchema.pre("remove", async function (next) {
  const User = require("./User");
  User.updateMany(
    { groups: this },
    { $pull: { groups: this._id } },
    { multi: true }
  ).exec(next);
});

module.exports = model("groups", groupSchema);
