const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  categories: [String],
  tags: [String],
  dateAdded: { type: Date, default: Date.now },
  insights: [String],
  personalGrowthNotes: String,
  relatedConcepts: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);