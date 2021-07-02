const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  }

});

module.exports = mongoose.model("Image", imageSchema);
