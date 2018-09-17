const mongoose = require("mongoose");
const Schema   = mongoose.Schema;



const repoSchema = new Schema({
  name: String,
  description: String,
  creator: String,
  trackList: Array,
  repoImage: String,
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Repo = mongoose.model("Repo", repoSchema);

module.exports = Repo;