const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const studentSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    otherName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, required: true, lowercase: true, enum: ["male", "female"] },
    classroom: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }]
  },
  {
    timestamps: true,
  }
);
const Student = model('Student', studentSchema);
module.exports = Student;
