const Joi = require('joi')

const signUpSchema = Joi.object({
	name: Joi.string().trim().min(1).max(100).required(),
	phone: Joi.string()
		.trim()
		.pattern(/^\+?[1-9]\d{1,14}$/)
		.allow('', null)
		.optional(),
	avatarUrl: Joi.string().trim().uri().allow('', null).optional(),
})

module.exports = { signUpSchema }
