// backend/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    level: { type: String, required: true },
    instructor: { type: String, required: true },
    image: { type: String, required: true },
    modules: [{ type: String }],
    skills: [{ type: String }],
    certificateUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);