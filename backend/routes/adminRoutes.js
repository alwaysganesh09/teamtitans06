// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Resource = require('../models/Resource');
const Course = require('../models/Course');
const Contact = require('../models/Contact');

// Placeholder for future authentication middleware
const authenticate = (req, res, next) => {
    // In a real app, you would verify a JWT or session
    next(); 
};

// Projects Routes
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/projects', authenticate, async (req, res) => {
    const project = new Project(req.body);
    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) { res.status(400).json({ message: err.message }); }
});
router.put('/projects/:id', authenticate, async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
        res.json(updatedProject);
    } catch (err) { res.status(400).json({ message: err.message }); }
});
router.delete('/projects/:id', authenticate, async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Resources Routes
router.get('/resources', async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/resources', authenticate, async (req, res) => {
    const resource = new Resource(req.body);
    try {
        const newResource = await resource.save();
        res.status(201).json(newResource);
    } catch (err) { res.status(400).json({ message: err.message }); }
});
router.put('/resources/:id', authenticate, async (req, res) => {
    try {
        const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedResource) return res.status(404).json({ message: 'Resource not found' });
        res.json(updatedResource);
    } catch (err) { res.status(400).json({ message: err.message }); }
});
router.delete('/resources/:id', authenticate, async (req, res) => {
    try {
        const deletedResource = await Resource.findByIdAndDelete(req.params.id);
        if (!deletedResource) return res.status(404).json({ message: 'Resource not found' });
        res.json({ message: 'Resource deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Courses Routes
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/courses', authenticate, async (req, res) => {
    const course = new Course(req.body);
    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (err) { res.status(400).json({ message: err.message }); }
});
router.put('/courses/:id', authenticate, async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
        res.json(updatedCourse);
    } catch (err) { res.status(400).json({ message: err.message }); }
});
router.delete('/courses/:id', authenticate, async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });
        res.json({ message: 'Course deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Contacts Routes
router.post('/contacts', async (req, res) => {
    const contact = new Contact(req.body);
    try {
        const newContact = await contact.save();
        res.status(201).json(newContact);
    } catch (err) { res.status(400).json({ message: err.message }); }
});
router.get('/contacts', authenticate, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/contacts/:id/read', authenticate, async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!updatedContact) return res.status(404).json({ message: 'Contact not found' });
        res.json(updatedContact);
    } catch (err) { res.status(400).json({ message: err.message }); }
});
router.delete('/contacts/:id', authenticate, async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) return res.status(404).json({ message: 'Contact not found' });
        res.json({ message: 'Contact deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;