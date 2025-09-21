const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }   ,
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
});

const Tags = mongoose.model('Tags', tagsSchema);

module.exports = Tags;
