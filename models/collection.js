const mongoose = require("mongoose");
const Schema   = mongoose.Schema;



const collectionSchema = new Schema({
  name: String,
  description: String,
  creator: String,
  repoList: Array,
  collectionImage: String,
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Repo = mongoose.model("Repo", repoSchema);

module.exports = Repo;