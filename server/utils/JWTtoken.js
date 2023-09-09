// Creating and Save in cookie


const sendToken = (user,statuscode,res)=>{
    try {
        const token = user.getJWTToken()
    //options for cookie
    const options = {
        expires:new Date(
            Date.now() + 5*24*60*60*1000
        ),
        httpOnly:true
    }

    res.status(statuscode).cookie("token",token,options).json({
        success:true,
        user,
        token
    })
    } catch (error) {
        console.log(error);
    }
}

module.exports=sendToken