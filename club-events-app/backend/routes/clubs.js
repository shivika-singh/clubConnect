const express = require('express');
const { body, validationResult } = require('express-validator');
const Club = require('../models/Club');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/clubs
// @desc    Get all active clubs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Search by name or description if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const clubs = await Club.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ clubs });
  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/clubs/:id
// @desc    Get club by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).select('-password');
    
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.json({ club });
  } catch (error) {
    console.error('Get club error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/clubs/slug/:slug
// @desc    Get club by slug (URL-friendly name)
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const club = await Club.findOne({ 
      name: { $regex: new RegExp('^' + slug.replace(/-/g, ' '), 'i') },
      isActive: true 
    }).select('-password');
    
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.json({ club });
  } catch (error) {
    console.error('Get club by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/clubs/:id
// @desc    Delete club (deactivate)
// @access  Private (Club owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if the authenticated club is the owner
    if (club._id.toString() !== req.club._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this club' });
    }

    // Deactivate instead of deleting
    club.isActive = false;
    await club.save();

    res.json({ message: 'Club deactivated successfully' });
  } catch (error) {
    console.error('Delete club error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
