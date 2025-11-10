const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
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
  membershipNumber: {
    type: String,
    unique: true,
    required: false  // Will be generated in pre-save hook
  },
  membershipFee: {
    type: Number,
    required: false,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    trim: true
  },
  paymentOrderId: {
    type: String,
    trim: true
  },
  paymentDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'expired', 'cancelled'],
    default: 'pending'
  },
  expiryDate: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1); // 1 year membership
      return date;
    }
  },
  additionalInfo: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
membershipSchema.index({ club: 1, email: 1 });
membershipSchema.index({ membershipNumber: 1 });
membershipSchema.index({ paymentStatus: 1 });

// Generate unique membership number before saving
membershipSchema.pre('save', async function(next) {
  if (!this.membershipNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.membershipNumber = `MEM-${timestamp}-${random}`;
  }
  next();
});

// Check for duplicate membership
membershipSchema.statics.checkDuplicate = async function(clubId, email) {
  const existing = await this.findOne({ 
    club: clubId, 
    email: email,
    status: { $in: ['pending', 'active'] }
  });
  return !!existing;
};

module.exports = mongoose.model('Membership', membershipSchema);
