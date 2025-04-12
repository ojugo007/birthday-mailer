const mongoose = require("mongoose")

const MONGODB_CONNECTION_URI= process.env.MONGODB_CONNECTION_URI
const connectDB=()=>{
    mongoose.connect(MONGODB_CONNECTION_URI)

    mongoose.connection.on("connected", ()=>{
        console.log("connected to database successfully")
    })

    mongoose.connection.on("error", (err)=>{
        console.log("unable to connect to database: ", err.message )
    })
}

module.exports = {connectDB}