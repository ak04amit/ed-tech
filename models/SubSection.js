const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    timeDuration: {
        type: Number,
        required: true
    },
    videoUrl: {
        type: String,
        required: true,
        trim: true
    }
});

const SubSection = mongoose.model("SubSection", SubSectionSchema);

module.exports = SubSection;

   