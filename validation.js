const Joi = require("joi")


const schema = Joi.object({
    username : Joi.string()
        .alphanum()
        .min(3)
        .max(10)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    dob : Joi.date()
        .required(),
})

const validateUser = async(req, res, next)=>{
    const payload = req.body
    try{
        await schema.validateAsync(payload, { abortEarly: false })
        next()
    }catch(error){
        next({
            status: 400, 
            message: "Validation error",
            details: error.details.map(err => err.message)
        })
    }
}

module.exports = {validateUser}