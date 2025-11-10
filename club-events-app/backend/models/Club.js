const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Sports', 'Academic', 'Cultural', 'Technology', 'Arts', 'Community', 'Other'],
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  foundedYear: {
    type: Number
  },
  memberCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  socialMedia: {
    instagram: String,
    facebook: String,
    twitter: String,
    linkedin: String
  },
  membershipFee: {
    type: Number,
    default: 0
  },
  membershipDriveOpen: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
clubSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
clubSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
clubSchema.methods.toJSON = function() {
  const clubObject = this.toObject();
  delete clubObject.password;
  return clubObject;
};

module.exports = mongoose.model('Club', clubSchema);
