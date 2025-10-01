const User  = require("../models/User");
const OTP =  require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();


//send OTP 

exports.sendOTP = async(req,res) =>{
   try{
     //fetch email 
    const{email}=req.body ;

    //check user exists ?
    const checkUserPresent = await User.findOne({email});

    //if user already exists , then return a response 
    if(checkUserPresent){
        return res.status(401).json({
            success: false ,
            message: 'user already registered '
        })
    }
     //generate OTP
     var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
     });
     console.log("OTp generated:", otp)

     //check uniq otp or not 
     let result = await OTP.findOne({otp:otp});

     while(result){
        otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
     });
     result = await OTP.findOne({otp:otp});
     }

     const otpPayload = {email,otp};

     //createe an entry for OTP
     const OtpBody = await OTP.create(otpPayload);
     console.log(OtpBody);

     //return response successfully
     res.status(200).json({
        success: true ,
        message:"otp sent succesfully", otp,

     })

   }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
    
}



//signUp
exports.signUp = async(req,res) =>{
try{
    
    //data fetch 
    const{
        firstName ,
        lastName ,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber , 
        otp
    } = req.body;

    //data validate
    if(!firstName || !lastName || !email || !password || !confirmPassword||!otp){
        return res.status(403).json({
            success:false,
            message:"all fields are required",
        })
    }

    //2 password match karlo
    if(password!== confirmPassword){
        return res.status(400).json({
            success: false,
            message:"password and confirmPassword value does not match , please try again"
        });
    }

    //check user already or not 
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success: false ,
            message :"User is already registeed ",
        });
    }

    //find most recent otp for user 
    const recentOTP = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOTP);

    //validate otp 
    if(recentOTP.length ==0){
        //otp nhi mila 
        return res.status(400).json({
            success : false,
            message : "otp not found"
        })
    }
    else if (otp!==recentOTP[0].otp){
        //invalid otp 
        return res.status(400).json({
            success: false ,
            message:"invalid Otp",
        })
    }
    
    //hash password 
    const hashedPassword = await bcrypt.hash(password,10);

    //create entry in db 
    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth: null,
        about:null,
        contactNumber: null,
    });

    const newUser = await User.create({
        firstName ,
        lastName ,
        email,
        contactNumber,
        password: hashedPassword,
        accountType,
        additionalDetails : profileDetails._id,
        image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    }) 

    //return response 
    return res.status(200).json({
        success: true ,
        message :"user registered succesfully",
        user:newUser
    });

}
catch(error){
    console.log(error);
    res.status(500).json({
        success: false ,
        message :"user cannot be registered . Please try again ",
    })
}
}



// login
exports.login = async (req,res) =>{
    try{
        //get data from req body 
        const {email,password}=req.body;
        //validation of data
        if(!email||!password){
            return res.status(403).json({
                success:false,
                message:'all fields are required , please try again ',

            });
        }
        //check user exist or not 
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message : "User is not registered , please signUp first",

            });
        }

        //generate JWT , after password is matched 
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email:user.email,
                id : user._id,
                role: user.accountType,

            }
            const token  = JWT.sign(payload, process.env.JWT_SECRET,{
                expiresIn: "2h",
            });
            user.token = token ;
            user.password = undefined ;
            //create cookie and send response 
        const options ={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token", token , options).status(200).json({
            success:true,
            token,
            user,
            message:"logged in succesfully",
        })


        }
        else{
            return res.status(401).json({
                success: false ,
                message : 'password is incorrect',
            })
        }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false , 
            message :"login failure , please try again ",
        });

    }
};



//changePassword--->HOMEWORK
exports.changePassword = async (req,res)=>{
    //get data from req body 
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;
    //get old password , new password and confirm new password 
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    //validation 
    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "New password and confirm password do not match"
        });
    }
    //update pasword in db 
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    //send mail to user
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password Changed Successfully",
        text: "Your password has been changed successfully."
    };
    await transporter.sendMail(mailOptions);
    //return response
    return res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });     

    
}