const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNo: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String } 
});

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [studentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);