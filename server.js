const express = require("express")
require("dotenv").config()
const database = require("./db")
const UserModel = require("./models/user.models")
const {validateUser} = require("./validation")
const cors = require("cors")

const PORT = process.env.PORT || 8080
const server = express()
server.use(cors())
// connect to mongodb
database.connectDB()

server.set("views", "views")
server.set("view engine", "ejs")

server.use(express.urlencoded({extended:true}))
server.use(express.static("public"))

server.get("/", (req, res)=>{
    res.render("index")
})

server.post("/", validateUser , async(req, res)=>{
    const payload = req.body
   

    const {username, email, dob} = payload;

    if(!username || !email || !dob){
        res.status(400).json({ message : "All fields are required"})
    }

    try{
        await UserModel.create(payload)
        res.status(201).redirect("/thanks")
    }catch(error){
        res.status(500).json({message : "unexpected server error" + error.message })
    }
    
})

server.get("/thanks", (req,res)=>{
    res.render('thanks')
})

// "0 7-19/2 * * *"

server.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message || "Something went wrong",
        details: err.details || null,
    });
});

server.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})