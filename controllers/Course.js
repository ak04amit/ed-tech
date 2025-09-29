const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const uploadImageToCloudinary = require("../utils/imageUploader");

//create course handler function  
exports.createCourse = async (req,res) =>{
    try {
        
        //fetch data
        const{CourseName,CourseDescription,whatYouWillLearn,price,tag} = req.body ;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage ;

        //validation
        if(!CourseName || !CourseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            });
        }

        //check for instructor
        const userId = req.user.id ;
        const instructorDetails = await User.findById(userId);
        console.log("instructorDetails", instructorDetails);
        //TODO - verify that userId and instructorDetails._id are same or not

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"user not found"
            });
        }      
        
        //check given tag is valid or not
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"tag details not found"
            });
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create entry in db for new course
        const newCourse = await Course.create({
            CourseName,
            CourseDescription,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
            instructor: instructorDetails._id
        });
        //add the new course to user schema of instructor
        await User.findByIdAndUpdate(instructorDetails._id,{
            $push: {courses: newCourse._id}
        },{new:true}); 
        
        //update the tag schema with this course
        await Tag.findByIdAndUpdate(tagDetails._id,{
            $push: {courses: newCourse._id}
        },{new:true});  

        //return response
        return res.status(200).json({
            success:true,
            message:"course created successfully",
            course: newCourse
        });



    } catch (error) {
        console.error("Error creating course:", error);
        return res.status(500).json({
            success: false,
            message: "failed to create course",
            error: error.message
        });
    }
};


//get all courses handler function  
exports.getAllCourses = async (req,res) =>{
    try {
        //fetch all courses from db
        const allCourses = await Course.find({},{CourseName: true,  price: true, tag: 1, thumbnail: true , instructor: true , ratingAndReviews: true,
            stuydentsEnrolled: true}).populate("instructor").populate("tag");
        //return response
        return res.status(200).json({
            success:true,
            message:"all courses fetched successfully",
            courses: allCourses
        });     
    } catch (error) {
        console.error("Error fetching all courses:", error);
        return res.status(500).json({   
            success: false,     
            message: "failed to fetch all courses",
            error: error.message
        });
    }
};
