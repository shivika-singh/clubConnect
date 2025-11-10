const express = require('express');
const { body, validationResult } = require('express-validator');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const QRCode = require('qrcode');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/registrations
// @desc    Register for an event
// @access  Public
router.post('/', [
  body('eventId').notEmpty().withMessage('Event ID is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('year').notEmpty().withMessage('Year is required'),
  body('branch').trim().notEmpty().withMessage('Branch is required'),
  body('gender').notEmpty().withMessage('Gender is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, name, email, phone, year, branch, gender, studentId, college, additionalInfo } = req.body;

    // Find event
    const event = await Event.findById(eventId).populate('club');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is available for registration
    if (event.status !== 'published') {
      return res.status(400).json({ message: 'Event is not available for registration' });
    }

    if (!event.isRegistrationOpen) {
      return res.status(400).json({ message: 'Registration is closed for this event' });
    }

    if (new Date() > event.registrationDeadline) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    if (event.maxParticipants !== null && event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Check for duplicate registration
    const isDuplicate = await Registration.checkDuplicate(eventId, email);
    if (isDuplicate) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Create registration
    const registration = new Registration({
      event: eventId,
      club: event.club._id,
      name,
      email,
      phone,
      year,
      branch,
      gender,
      studentId,
      college: college || 'Manipal University Jaipur',
      additionalInfo
    });

    await registration.save();

    // Generate QR code for registration
    try {
      const qrData = JSON.stringify({
        registrationId: registration._id,
        registrationNumber: registration.registrationNumber,
        eventId: event._id,
        eventName: event.title,
        name: registration.name,
        email: registration.email
      });
      registration.qrCode = await QRCode.toDataURL(qrData);
      await registration.save();
    } catch (qrError) {
      console.error('QR code generation error:', qrError);
    }

    // Increment event participants (with error handling)
    try {
      await event.incrementParticipants();
    } catch (incError) {
      // If event is full, delete the registration we just created
      await registration.deleteOne();
      return res.status(400).json({ message: 'Event is full. Registration was not completed.' });
    }

    await registration.populate('event', 'title startDate location');
    await registration.populate('club', 'name');

    res.status(201).json({
      message: 'Registration successful',
      registration
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message) 
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate registration number. Please try again.' });
    }
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/registrations/:id
// @desc    Get registration by ID
// @access  Public (for QR code verification)
router.get('/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('event', 'title startDate location poster')
      .populate('club', 'name');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ registration });
  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/registrations/number/:registrationNumber
// @desc    Get registration by registration number
// @access  Public
router.get('/number/:registrationNumber', async (req, res) => {
  try {
    const registration = await Registration.findOne({ 
      registrationNumber: req.params.registrationNumber 
    })
      .populate('event', 'title startDate location poster')
      .populate('club', 'name');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ registration });
  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/registrations/:id/checkin
// @desc    Check in attendee
// @access  Private (Club owner only)
router.put('/:id/checkin', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('club');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if club owns this registration
    if (registration.club._id.toString() !== req.club._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (registration.attendance.checkedIn) {
      return res.status(400).json({ message: 'Already checked in' });
    }

    registration.attendance.checkedIn = true;
    registration.attendance.checkedInAt = new Date();
    registration.status = 'attended';
    await registration.save();

    res.json({ message: 'Checked in successfully', registration });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/registrations/:id/checkout
// @desc    Check out attendee
// @access  Private (Club owner only)
router.put('/:id/checkout', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('club');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if club owns this registration
    if (registration.club._id.toString() !== req.club._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!registration.attendance.checkedIn) {
      return res.status(400).json({ message: 'Not checked in yet' });
    }

    if (registration.attendance.checkedOut) {
      return res.status(400).json({ message: 'Already checked out' });
    }

    registration.attendance.checkedOut = true;
    registration.attendance.checkedOutAt = new Date();
    await registration.save();

    res.json({ message: 'Checked out successfully', registration });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/registrations/:id
// @desc    Cancel registration
// @access  Public (with email verification)
router.delete('/:id', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const registration = await Registration.findById(req.params.id)
      .populate('event');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Verify email
    if (registration.email.toLowerCase() !== req.body.email.toLowerCase()) {
      return res.status(403).json({ message: 'Email does not match' });
    }

    // Decrement event participants
    if (registration.event) {
      await registration.event.decrementParticipants();
    }

    await registration.deleteOne();

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/registrations/event/:eventId
// @desc    Get all registrations for an event (for public view)
// @access  Public
router.get('/event/:eventId', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registrations = await Registration.find({ 
      event: req.params.eventId,
      status: 'confirmed'
    })
      .select('name year branch createdAt')
      .sort({ createdAt: -1 })
      .limit(100); // Limit to prevent overload

    res.json({ 
      registrations,
      total: await Registration.countDocuments({ event: req.params.eventId, status: 'confirmed' })
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/registrations/club/:clubId
// @desc    Get all registrations for a club's events
// @access  Private (Club owner only)
router.get('/club/:clubId', auth, async (req, res) => {
  try {
    if (req.club._id.toString() !== req.params.clubId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const events = await Event.find({ club: req.params.clubId });
    const eventIds = events.map(e => e._id);

    const registrations = await Registration.find({ 
      club: req.params.clubId,
      event: { $in: eventIds }
    })
      .populate('event', 'title startDate')
      .sort({ createdAt: -1 });

    res.json({ registrations });
  } catch (error) {
    console.error('Get club registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
