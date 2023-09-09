const app = require("./app")
const path = require("path")
const dotenv = require("dotenv")
const database = require("./config/database")

// Handle UnCaught error
process.on("uncaughtException", (err) => {
    console.log("UnCaught Error: " + err)
    console.log("shout down the server");
     process.exit(1)
});

// configute Dotenv
dotenv.config({ path: path.join(__dirname, "../server/config/config.env") })

//call database function
database()

const server = app.listen(process.env.PORT,()=>{
    console.log(`server is connect is http://localhost:${process.env.PORT}`);
})

// UnHandle Promice Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log("sutting down the server");

    server.close(()=>{
        process.exit(1);
    })
})











