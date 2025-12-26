const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    maxlength: 5
  },
  country: {
    type: String,
    required: true
  },
  flagUrl: {
    type: String
  }
});

module.exports = mongoose.model("League", LeagueSchema);
