const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');
const QRCode = require('qrcode');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      status, 
      featured, 
      search, 
      clubId,
      upcoming,
      page = 1,
      limit = 12 
    } = req.query;

    let query = {};

    // Filter by status (default to published)
    if (status) {
      query.status = status;
    } else {
      query.status = 'published';
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Filter by club
    if (clubId) {
      query.club = clubId;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter upcoming events
    if (upcoming === 'true') {
      query.startDate = { $gte: new Date() };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const events = await Event.find(query)
      .populate('club', 'name profileImage category')
      .sort({ startDate: 1, featured: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.json({
      events,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('club', 'name email profileImage category description location website contactPhone');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Increment views
    event.views += 1;
    await event.save();

    res.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Club auth required)
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('registrationDeadline').isISO8601().withMessage('Valid registration deadline is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventData = {
      ...req.body,
      club: req.club._id
    };

    const event = new Event(eventData);
    await event.save();

    // Generate QR code for event
    try {
      const qrData = JSON.stringify({
        eventId: event._id,
        eventName: event.title,
        clubName: req.club.name
      });
      event.qrCode = await QRCode.toDataURL(qrData);
      await event.save();
    } catch (qrError) {
      console.error('QR code generation error:', qrError);
    }

    await event.populate('club', 'name profileImage category');

    res.status(201).json({ event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Club owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if club owns this event
    if (event.club.toString() !== req.club._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    Object.assign(event, req.body);
    await event.save();

    await event.populate('club', 'name profileImage category');

    res.json({ event });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Club owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if club owns this event
    if (event.club.toString() !== req.club._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ event: event._id });

    await event.deleteOne();

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id/registrations
// @desc    Get all registrations for an event
// @access  Private (Club owner only)
router.get('/:id/registrations', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if club owns this event
    if (event.club.toString() !== req.club._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const registrations = await Registration.find({ event: event._id })
      .sort({ createdAt: -1 });

    res.json({ registrations });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id/stats
// @desc    Get event statistics
// @access  Private (Club owner only)
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if club owns this event
    if (event.club.toString() !== req.club._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const totalRegistrations = await Registration.countDocuments({ event: event._id });
    const confirmedRegistrations = await Registration.countDocuments({ 
      event: event._id, 
      status: 'confirmed' 
    });
    const attendedRegistrations = await Registration.countDocuments({ 
      event: event._id, 
      'attendance.checkedIn': true 
    });

    res.json({
      totalRegistrations,
      confirmedRegistrations,
      attendedRegistrations,
      currentParticipants: event.currentParticipants,
      maxParticipants: event.maxParticipants,
      views: event.views
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
