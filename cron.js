require("dotenv").config();
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const UserModel = require("./models/user.models");
const database = require("./db");

// Connect to MongoDB
database.connectDB();

// === Birthday Email Job ===
schedule.scheduleJob("0 7 * * *", async function () {
    const presentDate = new Date();

    const startOfDay = new Date(presentDate.getFullYear(), presentDate.getMonth(), presentDate.getDate());
    const endOfDay = new Date(presentDate.getFullYear(), presentDate.getMonth(), presentDate.getDate() + 1);

    try {
        let user = await UserModel.findOne({
            $and: [
                { birthday: { $gte: startOfDay, $lt: endOfDay } },
                { isSent: false }
            ]
        });

        if (!user) {
            console.log("No birthdays today.");
            return;
        }

        const CONFIG = {
            service: 'gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PSWD
            },
            tls: {
                rejectUnauthorized: false,
            }
        };
        const transporter = nodemailer.createTransport(CONFIG);

        let MailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Mailgen",
                link: "https://mailgen.js/"
            }
        });

        let response = {
            body: {
                name: user.username,
                intro: [
                    "On behalf of all of us at Ojay-tech, I’d like to wish you a very happy birthday! 🎉",
                    "We hope your day is filled with joy, laughter, and celebration."
                ],
                outro: "Wishing you continued success and happiness—today and always!"
            }
        };

        let mail = MailGenerator.generate(response);
        let msg = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "🎉 Happy Birthday from Ojay-tech!",
            html: mail
        };

        let info = await transporter.sendMail(msg);
        if (info.accepted && info.accepted.length > 0) {
            console.log("Message sent:", info.messageId);
            user.isSent = true;
            await user.save();
        }

    } catch (error) {
        console.error("Error sending birthday email:", error.message);
    }
});

// === Reset isSent at the beginning of the year ===
schedule.scheduleJob("0 0 1 1 *", async function () {
    try {
        const result = await UserModel.updateMany({}, { $set: { isSent: false } });
        console.log(`Reset 'isSent' for ${result.modifiedCount} users.`);
    } catch (error) {
        console.error("Error resetting 'isSent':", error.message);
    }
});
