const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    fields: [
        {
            type: { type: String, required: true },
            label: String,
            options: [String],
            required: Boolean
        }
    ],
    pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }]
});

const FormModel = mongoose.model('Form', formSchema);
module.exports = FormModel;
