const mongoose = require('mongoose');
const dns = require('dns');

// Fix Windows Node.js DNS SRV resolution for mongodb+srv:// URIs
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

// Mongoose Schemas & Models
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  githubLink: { type: String, default: '' },
  liveLink: { type: String, default: '' },
  tools: { type: [String], default: [] }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

projectSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: 'Portfolio Inquiry' },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

inquirySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const visitorSchema = new mongoose.Schema({
  page: { type: String, default: '/' },
  ip: { type: String, required: true, unique: true },
  userAgent: { type: String },
  date: { type: String, required: true } // YYYY-MM-DD
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

visitorSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
const Inquiry = mongoose.model('Inquiry', inquirySchema);
const Visitor = mongoose.model('Visitor', visitorSchema);
const Otp = mongoose.model('Otp', otpSchema);

// Database Connection Function
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ MONGO_URI is missing in .env file!');
    return;
  }

  if (mongoUri.includes('<db_password>')) {
    console.warn('\n⚠️ WARNING: MONGO_URI in .env contains "<db_password>" placeholder.');
    console.warn('⚠️ Please replace <db_password> with your actual MongoDB Atlas database password in .env!\n');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('🍃 Connected to MongoDB Atlas Database successfully!');

    // Seed default projects if collection is empty
    const count = await Project.countDocuments();
    if (count === 0) {
      const defaultProjects = [
        {
          name: 'Town Taskers - Service Marketplace',
          description: 'A comprehensive full-stack service marketplace connecting local users with skilled service providers. Features real-time booking management, user ratings, responsive dashboard, and RESTful API backend.',
          image: '/uploads/default-project-1.svg',
          githubLink: 'https://github.com/sumit411patel',
          liveLink: 'https://towntaskers.com',
          tools: ['Django', 'React.js', 'Tailwind', 'PostgreSQL', 'REST API']
        },
        {
          name: 'Panachandbhai Farsan Mart E-Commerce',
          description: 'Custom e-commerce web platform for a leading snack manufacturer. Built with Django and React, supporting automated ordering, inventory tracking, secure payment gateway, and dynamic product catalog.',
          image: '/uploads/default-project-2.svg',
          githubLink: 'https://github.com/sumit411patel',
          liveLink: 'https://panachandbhaifarsan.com',
          tools: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind']
        },
        {
          name: 'AI Analytics & Data Dashboard',
          description: 'Modern data visualization portal featuring real-time telemetry analytics, interactive charts, role-based user authentication, dynamic data filtering, and automated report exports.',
          image: '/uploads/default-project-3.svg',
          githubLink: 'https://github.com/sumit411patel',
          liveLink: '',
          tools: ['React.js', 'Python', 'Django', 'Tailwind', 'Figma']
        }
      ];

      await Project.insertMany(defaultProjects);
      console.log('🌱 Seeded initial default projects into MongoDB.');
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
  }
};

module.exports = {
  connectDB,
  Project,
  Inquiry,
  Visitor,
  Otp
};
