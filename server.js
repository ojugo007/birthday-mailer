const express = require("express")
require("dotenv").config()
const database = require("./db")
const UserModel = require("./models/user.models")
const {validateUser} = require("./validation")
const schedule = require("node-schedule")
const nodemailer = require("nodemailer")
const Mailgen = require("mailgen")


const PORT = process.env.PORT || 8080
const server = express()
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
// "0 7 * * *"

const job = schedule.scheduleJob("0 7,9,11,13,15,17,19 * * *", async function(){
    const presentDate = new Date()
    const startOfDay = new Date(presentDate.getFullYear(), presentDate.getMonth(), presentDate.getDate())
    const endOfDay = new Date(presentDate.getFullYear(), presentDate.getMonth(), presentDate.getDate() + 1)
    console.log(startOfDay)

    try{

        let user = await UserModel.findOne({
            $and : [
                {birthday:{$gte:startOfDay,$lt:endOfDay}},
                {isSent:false}
            ]
        })

        console.log(user)

        if (!user) {
            console.log("no birthdays today");
            return;
        }

        console.log(user.username)


        const CONFIG = {
            service: 'gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PSWD
            },
            tls: {
                rejectUnauthorized: false, 
            }
        }
        const transporter = nodemailer.createTransport(CONFIG);
        
        let MailGenerator = new Mailgen({
            theme : "default",
            product : {
                name : "Mailgen",
                link : "https://mailgen.js/"
            }
        })
        
        let response ={
            body : {
                name : user.username,
                intro : ["On behalf of all of us at Ojay-tech, I\’d like to wish you a very happy birthday! We hope your day is filled with joy, laughter, and a chance to relax and celebrate.", "It\'s been a pleasure working with you, and we look forward to continuing our partnership in the year ahead"],
               
                outro : "Wishing you continued success and happiness—today and always!"
            }
        }

        let mail = MailGenerator.generate(response)
        let msg = {
            from : process.env.SENDER_EMAIL,
            to :  user.email,
            subject : "🎉 Happy Birthday from Ojay-tech!",
            html : mail
        }

        let info = await transporter.sendMail(msg)
        if(info.accepted && info.accepted.length > 0){
                console.log("Message sent: %s", info.messageId);
                user.isSent = true
                await user.save()
        }

    }catch(error){
        console.log(error.message)
    }
})

// resets the isSent attribute to false every beginning of the new year
const resetJob = schedule.scheduleJob('0 0 1 1 *', async function(){
    try{
        const result = await UserModel.updateMany({}, { $set: { isSent: false } });
        console.log(`successfully updated isSent attribute: ${result.modifiedCount} `)
        
    }catch(error){
        console.log("unable to update isSent")
    }
})

server.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message || "Something went wrong",
        details: err.details || null,
    });
});

server.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})