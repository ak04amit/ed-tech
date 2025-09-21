const mongoose = require('mongoose');

const ratingAndReviewSchema = new mongoose.Schema({ 
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    
        required: true
    },
    rating: {
        type: Number,   
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        trim: true
    }
}); 

const RatingAndReview = mongoose.model('RatingAndReview', ratingAndReviewSchema);

module.exports = RatingAndReview;