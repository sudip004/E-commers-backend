const Errorhandler =require("../utils/errorhandler")


module.exports=(err,req,res,next)=>{
    err.statuscode = err.statuscode || 500
    err.message = err.message || "Internal server Error"

    res.status(err.statuscode).json({
        success:false,
        Error:err,
    })
}















