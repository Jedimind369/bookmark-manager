
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { markdownify } = require('markitdown');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const markdown = await markdownify(req.file.buffer, {
      inputFormat: req.file.mimetype
    });

    res.json({ markdown });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

module.exports = router;
