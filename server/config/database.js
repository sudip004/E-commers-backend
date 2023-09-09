const mongoose = require("mongoose")

const database = ()=>{
    mongoose.set('strictQuery',false)
mongoose.connect("mongodb://localhost:27017/E-commeres",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>console.log("Database connected successfully"))
}

module.exports=database







