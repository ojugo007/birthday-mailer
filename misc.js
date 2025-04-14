// const express = require("express")
// require("dotenv").config()
// const database = require("./db")
// const UserModel = require("./models/user.models")
// const {validateUser} = require("./validation")
// const schedule = require("node-schedule")
// const nodemailer = require("nodemailer")
// const Mailgen = require("mailgen")


// const PORT = process.env.PORT || 8080
// const server = express()
// // connect to mongodb
// database.connectDB()

// server.set("views", "views")
// server.set("view engine", "ejs")

// server.use(express.urlencoded({extended:true}))

// server.get("/", (req, res)=>{
//     res.render("index")
// })

// server.post("/", validateUser , async(req, res)=>{
//     const payload = req.body
//     const date = payload.dob
//     console.log(date)
//     const {username, email, dob} = payload;

//     if(!username || !email || !dob){
//         res.status(400).json({ message : "All fields are required"})
//     }

//     try{
//         await UserModel.create(payload)
//         res.status(201).json({ message : "User created successfully" })
//     }catch(error){
//         res.status(500).json({message: error.message})
//     }
    
// })


// const job = schedule.scheduleJob("1 * * * *", async function(){
//     const presentDate = new Date()
//     const startOfDay = new Date(presentDate.getFullYear(), presentDate.getMonth(), presentDate.getDate())
//     const endOfDay = new Date(presentDate.getFullYear(), presentDate.getMonth(), presentDate.getDate() + 1)
   
//     try{
//         let user = await UserModel.findOne({
//             $and : [
//                 {dob:{$gte:startOfDay,$lt:endOfDay}},
//                 {isSent:false}
//             ]
//         })

//         if (!user) {
//             throw new Error('User not found');
//         }

//         console.log(user.username)

//         const message = `
//             <b> Dear ${user.username},</b><br/>
//             <br/>
//             <p>On behalf of all of us at Ojay-tech, I’d like to wish you a very happy birthday! We hope your day is filled with joy, laughter, and a chance to relax and celebrate.</p>
//             <p>It’s been a pleasure working with you, and we look forward to continuing our partnership in the year ahead.</p>
//             <p>Wishing you continued success and happiness—today and always!</p>
//             <br/>
//             </p>Warm regards,<br/>
//             Ojugo Silas<br/>
//             CEO<br/>
//             Ojay-tech</p>
//         `
//         const CONFIG = {
//             service: 'gmail',
//             auth: {
//                 user: process.env.SENDER_EMAIL,
//                 pass: process.env.SENDER_PSWD
//             },
//             tls: {
//                 rejectUnauthorized: false, 
//             }
//         }
//         const transporter = nodemailer.createTransport(CONFIG);
        
//         let MailGenerator = new Mailgen({
//             theme : "default",
//             product : {
//                 name : "Mailgen",
//                 link : "https://mailgen.js/"
//             }
//         })
        
//         let response ={
//             body : {
//                 name : "ojay-tech",
//                 intro : "On behalf of all of us at Ojay-tech, I’d like to wish you a very happy birthday! We hope your day is filled with joy, laughter, and a chance to relax and celebrate.It's been a pleasure working with you, and we look forward to continuing our partnership in the year ahead",
               
//                 outro : "Wishing you continued success and happiness—today and always!"
//             }
//         }

//         let mail = MailGenerator.generate(response)
//         let msg = {
//             from : process.env.SENDER_EMAIL,
//             to :  process.env.SENDER_PSWD,
//             subject : "🎉 Happy Birthday from Ojay-tech!",
//             html : mail
//         }

//         transporter.sendMail(msg)
//             .then((info)=>{
//                 if(info.accepted && info.accepted.length > 0){
//                     console.log("Message sent: %s", info.messageId);
//                     user.isSent = true
//                     user.save()
//                 }

//             }).catch((err)=>{
//                 console.log(err)
//             })
//         async function main() {
        
//             const info = await transporter.sendMail({
//               from: `"Ojugo Silas" <${process.env.SENDER_EMAIL}>`,
//               to: user.email,
//               subject: "🎉 Happy Birthday from Ojay-tech!", 
//               text: "On behalf of all of us at Ojay-tech, I’d like to wish you a very happy birthday! We hope your day is filled with joy, laughter, and a chance to relax and celebrate. It's been a pleasure working with you, and we look forward to continuing our partnership in the year ahead. Wishing you continued success and happiness—today and always!",
//               html: message, 
//             });
          
//             if(info.accepted && info.accepted.length > 0){
//                 console.log("Message sent: %s", info.messageId);
//                 user.isSent = true
//                 await user.save()
//             }
//         }

//         main().catch(err=>console.error(err));
        

//     }catch(error){
//         console.log(error.message)
//     }
// })
// server.use((err, req, res, next) => {
//     res.status(err.status || 500).json({
//         error: err.message || "Something went wrong",
//         details: err.details || null,
//     });
// });

// server.listen(PORT, ()=>{
//     console.log(`server is running on http://localhost:${PORT}`)
// })