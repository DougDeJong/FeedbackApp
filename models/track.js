const mongoose = require("mongoose");
const Schema   = mongoose.Schema;



const trackSchema = new Schema({
  name: String,
  description: String,
  creator: String,
  dateRecorded: Date,
  audioFile: String,
  repoName: String,
  trackImage: String
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Track = mongoose.model("Track", trackSchema);

module.exports = Track;