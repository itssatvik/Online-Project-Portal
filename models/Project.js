const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
  Students: {
    type: [String],
    required: [true, 'Please provide student names'],
    maxlength: 5,
  },
  ProjectName: {
    type: String,
    required: [true, 'Please provide the project name'],
    maxlength: 100,
  },
  Status: {
    type: String,
    enum: ['Waiting for Approval', 'Approved', 'Declined'],
    default: 'Waiting for Approval',
  },
  CollegeName: {
    type: String,
    required: [false, 'Please provide the college name'],
    maxlength: 100,
  },
  Plagiarism: {
    type: String,
    enum: ['Yes', 'No'],
  },
  Summary: {
    type: String,
    required: [true, 'Please provide the project summary'],
    maxlength: 100,
  },
  ProjectLink: {
    type: String,
    required: [true, 'Please provide the project link'],
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
