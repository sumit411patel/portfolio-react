const express = require('express');
const router = express.Router();
const { Inquiry } = require('../db');
const { requireAdminAuth } = require('../middleware/auth');

// POST submit inquiry (Public - Contact Section)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const newInquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : 'Portfolio Inquiry',
      message: message.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! Thank you for reaching out.',
      inquiryId: newInquiry._id
    });
  } catch (err) {
    console.error('Error submitting inquiry:', err);
    res.status(500).json({ error: 'Failed to submit inquiry: ' + err.message });
  }
});

// GET all inquiries (Admin)
router.get('/', requireAdminAuth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inquiries: ' + err.message });
  }
});

// PATCH update status (Admin: read / unread)
router.patch('/:id/status', requireAdminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    await Inquiry.findByIdAndUpdate(req.params.id, { status: status || 'read' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// DELETE inquiry (Admin)
router.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

module.exports = router;
