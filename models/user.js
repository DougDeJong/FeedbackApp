const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  image: String,
  repos: [{type: Schema.Types.ObjectId, ref: "Repo"}],
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("user", userSchema);

module.exports = User;