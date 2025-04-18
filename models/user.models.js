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
    },
    birthday : {
        type : Date,
    },
    isSent : {
        type : Boolean,
        default : false
    }

}, {timestamps:true})

UserSchema.pre('save', function(next){
    const currentYear = new Date().getFullYear()
    
    this.birthday = new Date(this.dob)
    this.birthday.setFullYear(currentYear)

    next()
})

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;