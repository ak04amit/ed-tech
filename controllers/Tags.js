const Tag = require("../models/Tags");

//create tag ka handler function 

exports.createTag = async (req , res)=>{
    try {
        //fetch data
        const {name , descpription} = req.body;
        //validation
        if(!name||!descpription){
            return res.status(400).json({
                success :false,
                message:'all fields are required',
            })  
        }
        //create entry in db 
        const tagDetails = await Tag.create({
            name:name ,
            description: descpription,
        });
        console.log(tagDetails);
        //return response
         return res.status(200).json({
                success :true,
                message:'Tag created successfully',
            })  
    } 
    catch (error) {
        return res.status(500).json({
            success : false ,
            message : error.message,
        })
        
    }
}

//get allTags handler function 

exports.showALlTags = async (req,res)=>{
    try {
        const allTags = await Tag.find({},{name:true, description:true});
        return res.status(200).json({
            success : true ,
            message : 'all tags return succesfully',
            allTags
        })

        
    } 
    catch (error) {
        return res.status(500).json({
            success : false ,
            message : error.message,
        })
        
    }
}