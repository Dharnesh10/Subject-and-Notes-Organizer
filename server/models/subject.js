const mongoose = require('mongoose');
const Joi = require('joi');

const subjectSchema = new mongoose.Schema(
    {
        subjectName: { type: String, required: true, trim: true },
        subjectContent: { type: String, required: true, trim: true },
    },
    {timestamps: true}
);

const Subject = mongoose.model('Subject', subjectSchema);

const subjectValidationSchema = Joi.object({
    subjectName: Joi.string().min(1).max(200).required(),
    subjectContent: Joi.string().min(1).required()
});

module.exports = {
    Subject,
    subjectValidationSchema
};
