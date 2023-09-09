const nodemailler = require("nodemailer")
// const { create } = require("../models/userModel")


const sendEmail = async (options)=> {
    const transpoter = nodemailler.createTransport({
        service:"gmail",
        auth:{
            user:"sudipbasakk1234@gmail.com",
            pass:"wrxnxwncjinmfvfh"
        }
    });

    const mailOptions ={
        from:"sudipbasakk1234@gmail.com",
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    await transpoter.sendMail(mailOptions)
}

module.exports=sendEmail








