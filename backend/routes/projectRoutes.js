const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Project } = require('../db');
const { requireAdminAuth } = require('../middleware/auth');

// Configure Multer Storage for Uploading Project Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'project-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (png, jpg, jpeg, svg, webp) are allowed!'));
    }
  }
});

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects: ' + err.message });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST create project (Admin)
router.post('/', requireAdminAuth, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, description, githubLink, liveLink, tools, imageUrl } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Project name and description are required.' });
    }

    let finalImagePath = '';
    if (req.file) {
      finalImagePath = '/uploads/' + req.file.filename;
    } else if (imageUrl && imageUrl.trim()) {
      finalImagePath = imageUrl.trim();
    } else {
      return res.status(400).json({ error: 'Project image is required.' });
    }

    let toolsArray = [];
    if (tools) {
      if (Array.isArray(tools)) {
        toolsArray = tools;
      } else if (typeof tools === 'string') {
        try {
          toolsArray = JSON.parse(tools);
        } catch (e) {
          toolsArray = tools.split(',').map(t => t.trim()).filter(Boolean);
        }
      }
    }

    const newProject = await Project.create({
      name: name.trim(),
      description: description.trim(),
      image: finalImagePath,
      githubLink: githubLink ? githubLink.trim() : '',
      liveLink: liveLink ? liveLink.trim() : '',
      tools: toolsArray
    });

    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project: ' + err.message });
  }
});

// PUT update project (Admin)
router.put('/:id', requireAdminAuth, upload.single('imageFile'), async (req, res) => {
  try {
    const projectId = req.params.id;
    const existing = await Project.findById(projectId);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { name, description, githubLink, liveLink, tools, imageUrl } = req.body;

    let finalImagePath = existing.image;
    if (req.file) {
      finalImagePath = '/uploads/' + req.file.filename;
    } else if (imageUrl && imageUrl.trim()) {
      finalImagePath = imageUrl.trim();
    }

    let toolsArray = existing.tools;
    if (tools !== undefined) {
      if (Array.isArray(tools)) {
        toolsArray = tools;
      } else if (typeof tools === 'string') {
        try {
          toolsArray = JSON.parse(tools);
        } catch (e) {
          toolsArray = tools.split(',').map(t => t.trim()).filter(Boolean);
        }
      }
    }

    const updated = await Project.findByIdAndUpdate(
      projectId,
      {
        name: name !== undefined ? name.trim() : existing.name,
        description: description !== undefined ? description.trim() : existing.description,
        image: finalImagePath,
        githubLink: githubLink !== undefined ? githubLink.trim() : existing.githubLink,
        liveLink: liveLink !== undefined ? liveLink.trim() : existing.liveLink,
        tools: toolsArray
      },
      { new: true }
    );

    res.json({ success: true, project: updated });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project: ' + err.message });
  }
});

// DELETE project (Admin)
router.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    const projectId = req.params.id;
    const existing = await Project.findById(projectId);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await Project.findByIdAndDelete(projectId);

    // Optionally delete uploaded image file if it's local
    if (existing.image && existing.image.startsWith('/uploads/default-') === false && existing.image.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', existing.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project: ' + err.message });
  }
});

module.exports = router;
