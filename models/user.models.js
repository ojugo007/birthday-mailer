const mongoose = require("mongoose")

const schema = mongoose.Schema

const UserSchema = new schema({
    username : {
        type : String,
        required : true, 
        unique: true
    },
    email:{
        type : String,
        required : true,
        unique : true
    },
    dob : {
        type : Date,
        required : true
    }
}, {timestamps:true})

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;