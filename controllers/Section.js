const Section = require("../models/Section");
const Course = require("../models/Course");
const User = require("../models/User");

exports.createSection = async (req, res) => {
    try {
        //data fetch
        const { sectionName, courseId } = req.body;
        //data validation 
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        //create section 
        const newSection = await Section.create({
            sectionName
        });
        //update course with section ObjectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, {
            $push: { courseContent: newSection._id }
        }, { new: true });   // use populate to replace section and subsection both in the updatedCourseDetails


        //return response
        res.status(201).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails
        });
    } catch (error) {
       return res.status(500).json({
            success: false,
            message: "Failed to create section",
            error: error.message
        });
    }
}

exports.updateSection = async (req, res) => {
    try {
        //data fetch    
        const {sectionId , sectionName } = req.body;
        //data validation

        if (!sectionId) {
            return res.status(400).json({
                success: false, 
                message: "Section id is required"
            });
        }

        //update section
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            sectionName
        }, { new: true });  
        if (!updatedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        //return response
        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            updatedSection
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update section",
            error: error.message
        });
    }
}

exports.deleteSection = async (req, res) => {
    try {
        //data fetch    
        const { sectionId } = req.body;       
        //delete section
        const deletedSection = await Section.findByIdAndDelete(sectionId);
        //todo - do we need to delete the section reference from course schema also
        //return response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            deletedSection
        });       
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete section",
            error: error.message
        });
    }
}