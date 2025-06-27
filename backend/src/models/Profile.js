import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    required: true,
    trim: true
  },
  about: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: false
  },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    website: String
  },
  resume: {
    type: String,
    required: false
  },
  skills: [{
    name: String,
    level: {
      type: Number,
      min: 0,
      max: 100
    },
    category: String
  }],
  contact: {
    email: String,
    phone: String,
    location: String
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;