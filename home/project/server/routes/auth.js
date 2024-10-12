const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);
    user = new User({ email, password, tier: 'premium', trialEndDate });
    await user.save();
    const token = jwt.sign({ id: user.id, tier: user.tier }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { email: user.email, tier: user.tier, trialEndDate: user.trialEndDate } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, tier: user.tier }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { email: user.email, tier: user.tier, trialEndDate: user.trialEndDate } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;