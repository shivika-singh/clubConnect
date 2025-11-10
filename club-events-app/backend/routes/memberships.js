const express = require('express');
const { body, validationResult } = require('express-validator');
const Membership = require('../models/Membership');
const Club = require('../models/Club');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/memberships
// @desc    Apply for club membership
// @access  Public
router.post('/', [
  body('clubId').notEmpty().withMessage('Club ID is required'),
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

    const { clubId, name, email, phone, year, branch, gender, studentId, college, additionalInfo } = req.body;

    // Find club
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if membership drive is open
    if (!club.membershipDriveOpen) {
      return res.status(400).json({ message: 'Membership drive is currently closed for this club' });
    }

    // Check for duplicate membership
    const isDuplicate = await Membership.checkDuplicate(clubId, email);
    if (isDuplicate) {
      return res.status(400).json({ message: 'You already have an active or pending membership for this club' });
    }

    // Create membership application
    const membership = new Membership({
      club: clubId,
      name,
      email,
      phone,
      year,
      branch,
      gender,
      studentId,
      college: college || 'Manipal University Jaipur',
      additionalInfo,
      membershipFee: club.membershipFee || 0,
      status: club.membershipFee > 0 ? 'pending' : 'active' // If free, activate immediately
    });

    await membership.save();

    // Increment club member count if membership is free (active)
    if (membership.status === 'active') {
      club.memberCount = (club.memberCount || 0) + 1;
      await club.save();
    }

    await membership.populate('club', 'name profileImage category');

    res.status(201).json({
      message: club.membershipFee > 0 
        ? 'Membership application submitted. Please complete payment to activate your membership.'
        : 'Membership application approved! Welcome to the club!',
      membership
    });
  } catch (error) {
    console.error('Membership application error:', error);
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
      return res.status(400).json({ message: 'Duplicate membership number. Please try again.' });
    }
    
    res.status(500).json({ 
      message: 'Server error during membership application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/memberships/:id
// @desc    Get membership by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id)
      .populate('club', 'name profileImage category');

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    res.json({ membership });
  } catch (error) {
    console.error('Get membership error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/memberships/club/:clubId
// @desc    Get all memberships for a club
// @access  Private (Club owner only)
router.get('/club/:clubId', auth, async (req, res) => {
  try {
    if (req.club._id.toString() !== req.params.clubId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const memberships = await Membership.find({ club: req.params.clubId })
      .sort({ createdAt: -1 });

    res.json({ memberships });
  } catch (error) {
    console.error('Get club memberships error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/memberships/:id/payment
// @desc    Update payment status
// @access  Public (for payment gateway callback)
router.put('/:id/payment', [
  body('paymentId').notEmpty().withMessage('Payment ID is required'),
  body('paymentStatus').isIn(['paid', 'failed']).withMessage('Invalid payment status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentId, paymentStatus, paymentOrderId } = req.body;
    const membership = await Membership.findById(req.params.id).populate('club');

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    membership.paymentId = paymentId;
    membership.paymentOrderId = paymentOrderId;
    membership.paymentStatus = paymentStatus;
    membership.paymentDate = paymentStatus === 'paid' ? new Date() : undefined;
    
    if (paymentStatus === 'paid') {
      membership.status = 'active';
      // Increment club member count
      membership.club.memberCount = (membership.club.memberCount || 0) + 1;
      await membership.club.save();
    }

    await membership.save();

    res.json({
      message: paymentStatus === 'paid' 
        ? 'Payment successful! Your membership is now active.'
        : 'Payment failed. Please try again.',
      membership
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/memberships/:id/status
// @desc    Update membership status (for club admin)
// @access  Private (Club owner only)
router.put('/:id/status', auth, [
  body('status').isIn(['active', 'expired', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const membership = await Membership.findById(req.params.id).populate('club');

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // Check if club owns this membership
    if (membership.club._id.toString() !== req.club._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const oldStatus = membership.status;
    membership.status = req.body.status;
    await membership.save();

    // Update club member count if status changed
    if (oldStatus === 'active' && req.body.status !== 'active') {
      membership.club.memberCount = Math.max(0, (membership.club.memberCount || 0) - 1);
      await membership.club.save();
    } else if (oldStatus !== 'active' && req.body.status === 'active') {
      membership.club.memberCount = (membership.club.memberCount || 0) + 1;
      await membership.club.save();
    }

    res.json({
      message: 'Membership status updated successfully',
      membership
    });
  } catch (error) {
    console.error('Update membership status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/memberships/number/:membershipNumber
// @desc    Get membership by membership number
// @access  Public
router.get('/number/:membershipNumber', async (req, res) => {
  try {
    const membership = await Membership.findOne({ 
      membershipNumber: req.params.membershipNumber 
    })
      .populate('club', 'name profileImage category');

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    res.json({ membership });
  } catch (error) {
    console.error('Get membership error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
