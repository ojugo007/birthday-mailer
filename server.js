const express = require("express")
require("dotenv").config()
const database = require("./db")
const UserModel = require("./models/user.models")
const {validateUser} = require("./validation")
const schedule = require("node-schedule")

const PORT = process.env.PORT || 8080
const server = express()
// connect to mongodb
database.connectDB()

server.set("views", "views")
server.set("view engine", "ejs")

server.use(express.urlencoded({extended:true}))

server.get("/", (req, res)=>{
    res.render("index")
})

server.post("/", validateUser , async(req, res)=>{
    const payload = req.body
    const date = payload.dob
    console.log(typeof(date))
    const {username, email, dob} = payload;

    if(!username || !email || !dob){
        res.status(400).json({ message : "All fields are required"})
    }

    try{
        await UserModel.create(payload)
        res.status(201).json({ message : "User created successfully" })
    }catch(error){
        res.status(500).json({message: error.message})
    }
    
})

// const job = schedule.scheduleJob("0/10 * * * * ?", async function(){
//     // console.log("job is running")
//     const presentDate = Date.now()
//     const dateObject = new Date(presentDate)

//     const formattedDate = dateObject
//     // const formattedDate = dateObject.toLocaleDateString()
//     console.log()
//     try{
//         let user = await UserModel.find({})
//         // console.log(user)
//     }catch(error){
//         console.log(error.message)
//     }
// })
server.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message || "Something went wrong",
        details: err.details || null,
    });
});

server.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})