const Profile = require('../models/Profile');
const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try {
        // data fetch
        const {  gender, dateOfBirth="", about="", contactNumber } = req.body;
        const id = req.user.id;
        // data validation
        if (!id || !gender || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        // update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender  = gender ;
        await profileDetails.save();
       
        
        // return response
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
}


//delete profile
// how can we schedule this delete request after 30 days of deactivation of account
exports.deleteProfile = async (req, res) => {
    try {
        // data fetch   
        const id = req.user.id;
        // data validation
        if (!id) {  
            return res.status(400).json({
                success: false,
                message: "User id is required"
            });
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;    
        // delete profile
        await Profile.findByIdAndDelete(profileId);
        await User.findByIdAndDelete(id);

        //unroll user from all enrolled courses
        const courses = await Course.find({ enrolledStudents: id });
        courses.forEach(async (course) => {
            course.enrolledStudents.pull(id);
            await course.save();
        });

        // return response
        res.status(200).json({
            success: true,
            message: "Profile deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete profile",
            error: error.message
        });
    }   
}


exports.getProfile = async (req, res) => {
    try {
        // data fetch   
        const id = req.user.id;
        // data validation and get user details
        if (!id) {  
            return res.status(400).json({
                success: false,
                message: "User id is required"
            });
        }
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            userDetails
        });
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
        
    }
}