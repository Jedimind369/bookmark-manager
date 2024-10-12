const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newBookmark = new Bookmark({
      ...req.body,
      userId: req.user.id,
    });
    const savedBookmark = await newBookmark.save();
    res.json(savedBookmark);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    res.json({ message: 'Bookmark deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const bookmarks = await Bookmark.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
        { categories: { $in: [new RegExp(q, 'i')] } },
      ],
    });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;