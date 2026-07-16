const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  date: { type: Date, required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  presentRollNos: [Number]

}, { timestamps: true });


attendanceSchema.index({ batch: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);