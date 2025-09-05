// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    technologies: [{ type: String }],
    status: { type: String, enum: ['completed', 'in-progress', 'planning'], required: true },
    demoUrl: { type: String },
    githubUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);