const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({

    gender :{
        Type: String,
    },
    dateOfBirth :{
        Type: Date,
    },  

    about :{
        Type: String,
        trim: true
    },

    contactNumber :{
        Type: String,
        trim: true
    },

});

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;
