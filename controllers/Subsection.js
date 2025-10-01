const Subsection = require('../models/SubSection');
const Section = require('../models/Section');
const Course = require('../models/Course');
const User = require('../models/User');
const uploadVideoToCloudinary = require("../utils/videoUploader");

// create subsection
exports.createSubSection = async (req, res) => {
    try {
        // data fetch
        const { title, description, timeDuration, sectionId } = req.body;
        const video = req.files.videofile;
        // data validation
        if (!title || !description || !timeDuration || !sectionId || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        // create subsection
        const subSectionDetails = await Subsection.create({
            title:title,
            description:description,
            timeDuration:timeDuration,
            videoUrl: uploadDetails.secure_url
        });
        // update section with subsection ObjectId
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            $push: { SubSection: subSectionDetails._id }
        }, { new: true }).populate('SubSection');
        // return response
        res.status(201).json({
            success: true,
            message: "Subsection created successfully",
            updatedSection
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create subsection",
            error: error.message
        });
    }}


    //update subsection
    exports.updateSubSection = async (req, res) => {
        try {
            //data fetch    
            const { subSectionId, title, description, timeDuration } = req.body;
            //data validation   
            if (!subSectionId) {
                return res.status(400).json({
                    success: false,
                    message: "Subsection id is required"
                });
            }
            //update subsection
            const updatedSubSection = await Subsection.findByIdAndUpdate(subSectionId, {
                title,
                description,
                timeDuration
            }, { new: true });
            if (!updatedSubSection) {
                return res.status(404).json({   
                    success: false,
                    message: "Subsection not found"
                });
            }           
            //return response
            res.status(200).json({
                success: true,
                message: "Subsection updated successfully",
                updatedSubSection
            });
        } catch (error) {
            return res.status(500).json({
                success: false, 
                message: "Failed to update subsection",
                error: error.message
            });
        }
    }

    //delete subsection
    exports.deleteSubSection = async (req, res) => {
    try {           
        //data fetch
        const { subSectionId, sectionId } = req.body;
        //data validation
        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false, 
                message: "Subsection id and Section id are required"
            });
        }
        //delete subsection
        const deletedSubSection = await Subsection.findByIdAndDelete(subSectionId);
        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "Subsection not found"
            });
        }   
        //update section by pulling out the subsection id from section
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            $pull: { SubSection: subSectionId }
        }, { new: true }).populate('SubSection');   
        if (!updatedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }
        //return response
        res.status(200).json({
            success: true,
            message: "Subsection deleted successfully",
            updatedSection
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete subsection",
            error: error.message
        });
    }   
}