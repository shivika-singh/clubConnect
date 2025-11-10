const express = require('express');
const QRCode = require('qrcode');
const { body, validationResult } = require('express-validator');
const Membership = require('../models/Membership');
require('dotenv').config();

const router = express.Router();

// UPI Payment Configuration
const UPI_ID = process.env.UPI_ID || 'shivika27may@okaxis';
const PAYEE_NAME = process.env.PAYEE_NAME || 'ClubConnect';

// @route   POST /api/payment/generate-qr
// @desc    Generate UPI QR code for membership payment
// @access  Public
router.post('/generate-qr', [
  body('membershipId').notEmpty().withMessage('Membership ID is required'),
  body('amount').isNumeric().withMessage('Amount is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { membershipId, amount } = req.body;

    const membership = await Membership.findById(membershipId).populate('club');
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // Generate UPI payment URI
    const upiUri = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Membership Fee - ${membership.club.name}`)}`;

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(upiUri, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 400,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Generate transaction reference
    const transactionRef = `MEM-${membershipId}-${Date.now()}`;

    // Update membership with transaction reference
    membership.paymentOrderId = transactionRef;
    await membership.save();

    res.json({
      qrCode: qrCodeDataUrl,
      upiId: UPI_ID,
      amount: amount,
      transactionRef: transactionRef,
      membershipId: membershipId,
      clubName: membership.club.name,
      studentName: membership.name
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({ message: 'Failed to generate payment QR code' });
  }
});

// @route   POST /api/payment/confirm
// @desc    Confirm payment manually (after user pays via UPI)
// @access  Public
router.post('/confirm', [
  body('membershipId').notEmpty().withMessage('Membership ID is required'),
  body('transactionId').notEmpty().withMessage('Transaction ID is required'),
  body('amount').isNumeric().withMessage('Amount is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { membershipId, transactionId, amount } = req.body;

    const membership = await Membership.findById(membershipId).populate('club');
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // Verify amount matches
    if (membership.membershipFee !== parseFloat(amount)) {
      return res.status(400).json({ message: 'Payment amount does not match membership fee' });
    }

    // Update membership payment status
    membership.paymentId = transactionId;
    membership.paymentStatus = 'paid';
    membership.paymentDate = new Date();
    membership.status = 'active';

    // Increment club member count
    if (membership.club) {
      membership.club.memberCount = (membership.club.memberCount || 0) + 1;
      await membership.club.save();
    }
    
    await membership.save();

    res.json({
      message: 'Payment confirmed successfully! Your membership is now active.',
      membership
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Payment confirmation failed' });
  }
});

// @route   GET /api/payment/status/:membershipId
// @desc    Get payment status for a membership
// @access  Public
router.get('/status/:membershipId', async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.membershipId)
      .populate('club', 'name');

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    res.json({
      membershipId: membership._id,
      paymentStatus: membership.paymentStatus,
      status: membership.status,
      amount: membership.membershipFee,
      paymentDate: membership.paymentDate,
      transactionId: membership.paymentId
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Failed to get payment status' });
  }
});

module.exports = router;
