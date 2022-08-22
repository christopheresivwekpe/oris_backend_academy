const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ClassSchema = new Schema(
  {
    level: { type: String, required: true, enum: ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"] },
    classAdvisor: { type: String, trim: true }
  },
  {
    timestamps: true,
  }
);
const Class = model('Class', ClassSchema);
module.exports = Class;