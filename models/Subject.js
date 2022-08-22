const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const subjectSchema = new Schema(
  {
    type: { type: String, required: true, trim: true },
    duration: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);
const Subject = model('Subject', subjectSchema);
module.exports = Subject;