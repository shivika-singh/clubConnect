const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Club = require('../models/Club');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (clubId) => {
  return jwt.sign({ clubId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register a new club
// @access  Public
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Club name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, description, category, location, website, contactPhone } = req.body;

    // Check if club already exists
    let club = await Club.findOne({ email });
    if (club) {
      return res.status(400).json({ message: 'Club already exists with this email' });
    }

    // Check if club name is already taken
    club = await Club.findOne({ name });
    if (club) {
      return res.status(400).json({ message: 'Club name already taken' });
    }

    // Create new club
    club = new Club({
      name,
      email,
      password,
      description,
      category,
      location,
      website,
      contactPhone
    });

    await club.save();

    // Generate token
    const token = generateToken(club._id);

    res.status(201).json({
      message: 'Club registered successfully',
      token,
      club: club.toJSON()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login club
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find club by email
    const club = await Club.findOne({ email });
    if (!club) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if club is active
    if (!club.isActive) {
      return res.status(400).json({ message: 'Club account is deactivated' });
    }

    // Compare password
    const isMatch = await club.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(club._id);

    res.json({
      message: 'Login successful',
      token,
      club: club.toJSON()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current club profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ club: req.club });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update club profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().notEmpty().withMessage('Club name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('description').optional().trim(),
  body('location').optional().trim(),
  body('website').optional().trim(),
  body('contactPhone').optional().trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, description, location, website, contactPhone } = req.body;
    const club = req.club;

    // Check if email is already taken by another club
    if (email && email !== club.email) {
      const existingClub = await Club.findOne({ email, _id: { $ne: club._id } });
      if (existingClub) {
        return res.status(400).json({ message: 'Email already taken by another club' });
      }
    }

    // Check if name is already taken by another club
    if (name && name !== club.name) {
      const existingClub = await Club.findOne({ name, _id: { $ne: club._id } });
      if (existingClub) {
        return res.status(400).json({ message: 'Club name already taken' });
      }
    }

    // Update club fields
    if (name) club.name = name;
    if (email) club.email = email;
    if (description !== undefined) club.description = description;
    if (location !== undefined) club.location = location;
    if (website !== undefined) club.website = website;
    if (contactPhone !== undefined) club.contactPhone = contactPhone;

    await club.save();

    res.json({
      message: 'Profile updated successfully',
      club: club.toJSON()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change club password
// @access  Private
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const club = req.club;

    // Verify current password
    const isMatch = await club.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    club.password = newPassword;
    await club.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
