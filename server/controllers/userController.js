const Errorhandler = require("../utils/errorhandler");
const catchasyncerrors = require("../middleware/catchasyncerrors");
const User = require("../models/userModel")
const sendToken = require("../utils/JWTtoken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const product = require("../models/productModel");

//Register a user
exports.register = async(req,res,next)=>{
    try {
        const{name,email,password} = req.body
    const user= await User.create({
        name,email,password,
        avtar:{
            public_id:"this is a sample id",
            url:"this is a sample id"
        }
    })

    sendToken(user,201,res)   
    } catch (error) {
        console.log(error);
        
    }
}


// Login a user
exports.Login= catchasyncerrors(async(req,res,next)=>{
    
        const {email, password}=req.body

        if(!email || !password){
              res.status(401).json({
                message:"please enter email and password"
              })
              
        }
        const user = await User.findOne({email}).select("+password")
        if(!user){
            res.status(401).json({
                message:"Invalid email or password"
              })
           
        }

        const iscompare = await user.comparePassword(password)
        if(!iscompare){
            res.status(401).json({
                message:"Please enter correct password"
              })
             
        }
        sendToken(user,200,res)
    
})

// Logout User

exports.Logout = catchasyncerrors( async(req,res,next) => {

        res.cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true
        })
    
        res.status(200).json({
            success:true,
            message:" Successfully Logged Out"
        })

})


// Forgot Password 
exports.forgotPassword = catchasyncerrors( async(req,res,next)=>{

        const user = await User.findOne({email:req.body.email})
        if(!user){
            res.status(400).json({
                success:false,
                message:"User Not Found"
            })
        }
        // Get user password Token
        const resetToken = user.ResetPasswordToken()

        const save = await user.save()
        

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

        const message = `your password reset token is :- \n\n${resetPasswordUrl}\n\n if you have not requested this email then, please ignore it`;

        if(save) {
            await sendEmail({
               email:user.email,
               subject:"Ecommerce Password Recivery",
               message
            })
            res.status(200).json({
                success:true,
                message:`Email sent to ${user.email} successfully`
            })
            
        } else {
            user.resatePasswordToken = undefined;
            user.resatePasswordExpires = undefined;
            await user.save({validateBeforeSave:false})
            return next()
           
        }
})

// Reset apassword
exports.resetPassword = catchasyncerrors( async(req,res,next)=>{

    const resatePasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

    const user = await User.findOne({
        resatePasswordToken,
        resatePasswordExpires:{ $gt: Date.now() }
    })

    if(!user){
        return res.status(401).json({
            success:false,
            message:"user Token is not valid"
        })
    }

    if(req.body.password != req.body.confirmpassword){
        return res.status(401).json({
            success:false,
            message:"confirm password not match"
        })
    }

    user.password = req.body.password;
    user.resatePasswordToken = undefined;
    user.resatePasswordExpires = undefined;

    // automatic login
    sendToken(user,200,res)
})

// Get User Details
exports.getuserDetails = catchasyncerrors( async (req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password")

    res.status(200).json({
        success:true,
        user
    })
})

//update user password
exports.updatepassword = catchasyncerrors( async(req,res,next)=>{
        
        const user = await User.findById(req.user.id).select("+password")

        const ispasswordMatched = await user.comparePassword(req.body.oldPassword)

        if(!ispasswordMatched){
            return  res.status(401).json({
                message:"Old password incorrect"
            })
        }

        if(req.body.newPassword !== req.body.oldPassword){
           return  res.status(401).json({
                message:"password does not match"
            })
        }

        user.password = req.body.newPassword

        await user.save()

        sendToken(user,200,res)

   
})


// update profile
exports.updateProfile = catchasyncerrors( async (req,res,next)=>{

     const userUpdate={
        name:req.body.name,
        email:req.body.email
     }

    const user = await User.findByIdAndUpdate(req.user.id,userUpdate,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true
    })
})

// Get all users (Admin)
exports.getAllUsers = catchasyncerrors( async (req,res,next)=>{
    const user = await User.find()

    res.status(200).json({
        success:true,
        user
    })
})

// Get Single user (Admin)
exports.getsingleUser = catchasyncerrors( async (req,res,next)=>{

        const user = await User.findById(req.params.id)

    if(!user){
        res.status(400).json({
            message:"user admin not found"
        })
        return next()
    }
    res.status(201).json({
        success:true,
        user
    })
    
})

// Update user role --Admin
exports.updateUserRole = catchasyncerrors( async (req,res,next)=>{

    const userUpdate={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
     }
 
    const user = await User.findByIdAndUpdate(req.params.id,userUpdate,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        user
    })

})

//Delete User role --Admin
exports.deleteUserRole = catchasyncerrors( async (req,res,next)=>{
        
       const user = await User.findById(req.params.id)
        // we will remove cloudnary leter
       if(!user){
        res.status(400).json({
            success:false,
            message:"user not found in delete user role"
        })
        return next()
       }
   await user.remove()

})

// Create Product Review
exports.createproductReview = async (req,res,next)=>{
     try {
        const {rating,comment, productId} = req.body
    const review = {
        user: req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const productfind = await product.findById(productId)

    const isreviewed = product.reviews.find((rev)=> rev.user.toString() === req.user._id.toString())

    if(isreviewed){
      productfind.reviews.forEach((rev)=>{
        if(rev.user.toString() === req.user._id.toString())
        rev.rating=rating,
        rev.comment=comment
      })
    }else {
        productfind.reviews.push(review)
        productfind.numOfReviews = rev.reviews.length
    }
      
    let avg =0;
    productfind.reviews.forEach((rev)=>{
        avg += rev.rating
    }) 

    productfind.ratings = avg / productfind.reviews.length

    await productfind.save({validateBeforeSave:false})

    res.status(200).json({
        message:true
    })
     } catch (error) {
        console.log(error);        
     }
}

// Get all A single product Review
exports.getproductreviews = async (req,res,next)=> {
    const productfind = await product.findById(req.query.id)

    if(!productfind){
        res.status(400).json({
            success:false,
            message:"product Not Found"
        })
    }
    res.status(200).json({
        success:true,
        message:productfind.reviews
    })
}

// Delete A Review
exports.deleteReview = async (req,res,next) => {
    try {
        
       const productfind = await product.findById(req.query.productId)
       
    if(!productfind){
        res.status(400).json({
            success:false,
            message:"product Not Found"
        })
    }

    const review = productfind.reviews.filter((rev)=> rev._id.toString() !== req.query.id.toString())

    let avg =0;
    review.forEach((rev)=>{
        avg += rev.rating
    }) 

   const ratings = avg / review.length

   const numOfReviews = review.length

   await product.findByIdAndUpdate(req.query.productId,{review,ratings,numOfReviews},{
    new:true,
    runValidators:true,
    useFindAndModify:false
   })

    } catch (error) {
        console.log(error);
    }
}