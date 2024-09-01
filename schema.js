const Joi = require("joi")

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
        proffesions: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        contact: Joi.number().required().min(10),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required()
})