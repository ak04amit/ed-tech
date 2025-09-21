const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

    CourseName: {
        type: String,
        required: true,
        trim: true
    },
    CourseDescription: {
        type: String,
        required: true,
        trim: true
    },
     instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    whatYouWillLearn: {
        type: String,
        required: true,
        trim: true
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"      
    }],
    ratingAndReviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview"
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true,
        trim: true,
        ref: "Tag"
    },  
    tag:{
        type: String,
        required: true,
        trim: true
    },

    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }]

});

const course = mongoose.model("Course", courseSchema);

module.exports = course;
