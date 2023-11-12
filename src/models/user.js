import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		username: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["admin", "user", "agent", "supervisor"],
			default: "user",
		},
		role_id: {
			type: Schema.Types.ObjectId,
			ref: "Role",
		},
		permissions: {
			type: String,
		},
		language: {
			type: String,
			enum: ["cn", "th", "vi", "en", "ms", "id", "tl"],
			default: "en",
		},
		//NOTE: You can change the gender options acc. to your needs in the app.
		gender: {
			type: String,
			enum: ["male", "female", "other"],
		},
		countryCode: {
			type: String,
		},
		timezone: {
			type: String,
			default: "Asia/Kuala_Lumpur",
		},
		birthDate: {
			type: Date,
		},
		photoUrl: {
			type: String,
			default: "https://t3.ftcdn.net/jpg/01/09/00/64/360_F_109006426_388PagqielgjFTAMgW59jRaDmPJvSBUL.jpg",
		},
		//NOTE: To check whether the account is active or not. When user deletes the account, you can store the information anonymously.
		isActivated: {
			type: Boolean,
			default: true,
		},
		//NOTE: To check whether the user skipped the email-verification step or not. You can delete the unverified accounts day by day.
		isVerified: {
			type: Boolean,
			required: true,
		},
		//NOTE: You can add more options acc. to your need.
		platform: {
			type: String,
			enum: ["android", "ios", "web"],
			default: "Web",
			required: true,
		},
		//NOTE: In case the user delete its account, you can store its non-personalized information anonymously.
		deletedAt: {
			type: Date,
		},
	},
	{
		versionKey: false,
		timestamps: true,
		strict: false,
	}
);

const User = model("User", userSchema);
export default User;
