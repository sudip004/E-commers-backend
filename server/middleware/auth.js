const jwt = require("jsonwebtoken");
const User = require("../models/userModel")

exports.isAuthenticatedUser = async(req,res,next) => {
   try {
    const {token }= await req.cookies

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Please first you login"
        })
    }
    const decodedata = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decodedata.id)

       next()
   } catch (error) {
    console.log(error);
   }
}

// User Authorozation
exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            res.status(401).json({
                succes:true,
                message:"You are not admin ..so you can't change anything"
            })
        }
        next()
    }
}



