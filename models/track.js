const mongoose = require("mongoose");
const Schema   = mongoose.Schema;



const trackSchema = new Schema({
  name: String,
  description: String,
  creator: String,
  dateRecorded: String,
  audioFile: String,
  repoName: {type: Schema.Types.ObjectId, ref: "Repo"},
  trackImage: String
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Track = mongoose.model("Track", trackSchema);

module.exports = Track;