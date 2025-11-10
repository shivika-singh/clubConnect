const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required']
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: [true, 'Club is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  year: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate', 'Other'],
    required: [true, 'Year is required']
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    required: [true, 'Gender is required']
  },
  studentId: {
    type: String,
    trim: true
  },
  college: {
    type: String,
    default: 'Manipal University Jaipur',
    trim: true
  },
  additionalInfo: {
    type: String,
    trim: true
  },
  registrationNumber: {
    type: String,
    unique: true,
    required: false  // Will be generated in pre-save hook
  },
  qrCode: {
    type: String,
    default: ''
  },
  attendance: {
    checkedIn: {
      type: Boolean,
      default: false
    },
    checkedInAt: {
      type: Date
    },
    checkedOut: {
      type: Boolean,
      default: false
    },
    checkedOutAt: {
      type: Date
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'attended'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'free'],
    default: 'free'
  },
  paymentId: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
registrationSchema.index({ event: 1, email: 1 });
registrationSchema.index({ registrationNumber: 1 });
registrationSchema.index({ club: 1, createdAt: -1 });

// Generate unique registration number before saving
registrationSchema.pre('save', async function(next) {
  if (!this.registrationNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.registrationNumber = `REG-${timestamp}-${random}`;
  }
  next();
});

// Check for duplicate registration
registrationSchema.statics.checkDuplicate = async function(eventId, email) {
  const existing = await this.findOne({ event: eventId, email: email });
  return !!existing;
};

module.exports = mongoose.model('Registration', registrationSchema);
