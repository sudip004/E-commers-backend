const express = require("express")
const cookieparser = require("cookie-parser")
const app =express()

// For use Json file

app.use(express.json())
 app.use(cookieparser())
// call the router
const product = require("./routes/productRoute")
const user = require("./routes/userRoute")
const order = require("./routes/orderRoutes")
app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/v1",order)
// Call Middleware 
const errorMiddleware = require("./middleware/error")
app.use(errorMiddleware)

//


module.exports=app


