const express = require('express');
const router = express.Router();
const { Visitor, Inquiry, Project } = require('../db');
const { requireAdminAuth } = require('../middleware/auth');

// POST track visitor hit (Public - Unique per IP address)
router.post('/track', async (req, res) => {
  try {
    const { page } = req.body || {};
    const rawIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Clean IP format (remove IPv6 prefix if local)
    const ip = rawIp === '::1' ? '127.0.0.1' : rawIp.replace(/^.*:/, '') || '127.0.0.1';

    // Check if a visitor record with this IP address already exists
    const existingVisitor = await Visitor.findOne({ ip });

    if (!existingVisitor) {
      // Create new visitor record ONLY if IP address is new / unique
      await Visitor.create({
        page: page || '/',
        ip,
        userAgent,
        date
      });
      return res.json({ success: true, newVisitor: true });
    }

    // IP already recorded -> do not duplicate visitor entry
    return res.json({ success: true, newVisitor: false, message: 'Visitor IP already recorded.' });
  } catch (err) {
    // Handle duplicate key error gracefully
    if (err.code === 11000) {
      return res.json({ success: true, newVisitor: false });
    }
    res.json({ success: false });
  }
});

// GET dashboard statistics & charts data (Admin)
router.get('/dashboard', requireAdminAuth, async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    const unreadInquiries = await Inquiry.countDocuments({ status: 'unread' });
    const totalProjects = await Project.countDocuments();

    // Visitor trends by date (Last 7 days)
    const visitorTrendsAgg = await Visitor.aggregate([
      { $group: { _id: '$date', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $limit: 7 }
    ]);

    const visitorTrends = visitorTrendsAgg.map(item => ({
      date: item._id,
      count: item.count
    })).reverse();

    // Recent inquiries
    const recentInquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalVisitors,
      totalInquiries,
      unreadInquiries,
      totalProjects,
      visitorTrends,
      recentInquiries
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data: ' + err.message });
  }
});

module.exports = router;
