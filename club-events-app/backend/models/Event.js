const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: [true, 'Club is required']
  },
  category: {
    type: String,
    enum: ['Workshop', 'Seminar', 'Competition', 'Social', 'Cultural', 'Sports', 'Technical', 'Other'],
    required: true
  },
  eventType: {
    type: String,
    enum: ['Online', 'Offline', 'Hybrid'],
    default: 'Offline'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  venue: {
    type: String,
    trim: true
  },
  maxParticipants: {
    type: Number,
    default: null // null means unlimited
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Registration deadline is required']
  },
  registrationFee: {
    type: Number,
    default: 0
  },
  isRegistrationOpen: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String,
    default: []
  }],
  poster: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  requirements: {
    type: String,
    trim: true
  },
  agenda: [{
    time: String,
    activity: String
  }],
  speakers: [{
    name: String,
    designation: String,
    image: String
  }],
  contactEmail: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  qrCode: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
eventSchema.index({ club: 1, startDate: -1 });
eventSchema.index({ status: 1, startDate: -1 });
eventSchema.index({ category: 1 });
eventSchema.index({ featured: 1 });

// Virtual for checking if registration is open
eventSchema.virtual('isRegistrationAvailable').get(function() {
  const now = new Date();
  return this.isRegistrationOpen && 
         this.status === 'published' && 
         now < this.registrationDeadline &&
         (this.maxParticipants === null || this.currentParticipants < this.maxParticipants);
});

// Method to increment participants
eventSchema.methods.incrementParticipants = async function() {
  // Reload event to get latest participant count
  const event = await this.constructor.findById(this._id);
  
  if (event.maxParticipants === null || event.maxParticipants === undefined || event.currentParticipants < event.maxParticipants) {
    event.currentParticipants = (event.currentParticipants || 0) + 1;
    return event.save();
  }
  throw new Error('Event is full');
};

// Method to decrement participants
eventSchema.methods.decrementParticipants = async function() {
  // Reload event to get latest participant count
  const event = await this.constructor.findById(this._id);
  
  if (event.currentParticipants > 0) {
    event.currentParticipants -= 1;
    return event.save();
  }
  return event;
};

module.exports = mongoose.model('Event', eventSchema);
