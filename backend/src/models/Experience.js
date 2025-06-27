import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: false,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  highlights: [{
    type: String,
    trim: true
  }],
  companyLogo: {
    type: String,
    required: false
  },
  companyUrl: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;