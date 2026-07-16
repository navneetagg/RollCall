const router = require('express').Router();
const auth = require('../middleware/auth');
const Batch = require('../models/Batch');


router.post('/', auth, async (req, res) => {
  try {
    const { name, students } = req.body; 
    const batch = await Batch.create({ name, teacher: req.user._id, students });
    res.status(201).json(batch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const batches = await Batch.find({ teacher: req.user._id });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', auth, async (req, res) => {
  try {
    const batch = await Batch.findOne({ _id: req.params.id, teacher: req.user._id });
    if (!batch) return res.status(404).json({ error: 'Batch not found' });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;