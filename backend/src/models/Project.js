import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 160
  },
  image: {
    type: String,
    required: true
  },
  gallery: [{
    type: String
  }],
  technologies: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'desktop', 'other']
  },
  links: {
    github: String,
    live: String,
    demo: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  highlights: [{
    type: String
  }]
}, {
  timestamps: true
});

// Create slug from title before saving
projectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;