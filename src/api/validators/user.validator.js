import Joi from "joi";
// import objectId from "joi-objectid";
// Joi.objectId = objectId(Joi);

export function validateRegister(body) {
	const schema = Joi.object({
		email: Joi.string().email().min(3).required(),
		password: Joi.string().min(6).max(20).required(),
		name: Joi.string().min(3).max(24).required(),
		role: Joi.string().required(),
		type: Joi.string().optional(),
		language: Joi.string().valid("cn", "th", "vi", "en", "ms", "id", "tl").required(),
		platform: Joi.string().valid("android", "ios", "web").required(),
		timezone: Joi.string(),
	});
	return schema.validate(body);
}

export function validateUpdateRole(body) {
	const schema = Joi.object({
		name: Joi.string().required(),
		grant_permission: Joi.array().required(),
	});
	return schema.validate(body);
}

export function validateCreateTenant(body) {
	const schema = Joi.object({
		slug: Joi.string().required(),
		full_name: Joi.string().required(),
		company_name: Joi.string(),
		phone: Joi.string().required(),
		email: Joi.string().required(),
		type: Joi.string().required(),
		product: Joi.string(),
		country: Joi.string(),
	});
	return schema.validate(body);
}

export function validateLogin(body) {
	const schema = Joi.object({
		email: Joi.string().email().min(3).required(),
		password: Joi.string().min(6).max(20).required(),
	});
	return schema.validate(body);
}

export function validateSendVerificationCode(body) {
	const schema = Joi.object({
		email: Joi.string().email().min(3).required(),
	});
	return schema.validate(body);
}

export function validateVerifyEmail(body) {
	const schema = Joi.object({
		token: Joi.string().min(10).required(),
		code: Joi.string().length(4).required(),
	});
	return schema.validate(body);
}

export function validateRefreshToken(body) {
	const schema = Joi.object({
		refreshToken: Joi.string().min(10).required(),
	});
	return schema.validate(body);
}

export function validateForgotPassword(body) {
	const schema = Joi.object({
		password: Joi.string().min(6).max(20).required(),
	});
	return schema.validate(body);
}

export function validateChangePassword(body) {
	const schema = Joi.object({
		oldPassword: Joi.string().min(6).max(20).required(),
		newPassword: Joi.string().min(6).max(20).required(),
	});
	return schema.validate(body);
}

export function validateEditUser(body) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(24),
		username: Joi.string().min(3).max(15),
		language: Joi.string().valid("tr", "en"),
		gender: Joi.string().valid("male", "female", "other"),
		birthDate: Joi.date(),
	});
	return schema.validate(body);
}
