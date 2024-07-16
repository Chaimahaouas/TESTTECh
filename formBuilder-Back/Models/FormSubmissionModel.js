const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    page: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    data: { type: Map, of: String, required: true },
    CreatedAt: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
