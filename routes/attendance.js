const router = require('express').Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Batch = require('../models/Batch');
const excelExport = require('../utils/excelExport');


router.post('/mark', auth, async (req, res) => {
  try {
    const { batchId, date, presentRollNos } = req.body; 
    const batch = await Batch.findOne({ _id: batchId, teacher: req.user._id });
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    const attendance = await Attendance.findOneAndUpdate(
      { batch: batchId, date: new Date(date) },
      { presentRollNos, markedBy: req.user._id },
      { upsert: true, new: true, runValidators: true }
    );
    res.json({ message: 'Attendance saved', attendance });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/records/:batchId', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {
      batch: req.params.batchId,
      date: {}
    };
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);

    const records = await Attendance.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/download/:batchId', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const batch = await Batch.findOne({ _id: req.params.batchId, teacher: req.user._id });
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    const filter = { batch: req.params.batchId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const records = await Attendance.find(filter).sort({ date: 1 });

   
    const buffer = await excelExport(batch, records);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=attendance_${batch.name}.xlsx`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;