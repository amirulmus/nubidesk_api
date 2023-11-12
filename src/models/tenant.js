import mongoose from "mongoose";
const { Schema, model } = mongoose;

const tenantSchema = new Schema(
	{
		slug: {
			type: String,
			unique: true,
			required: true,
		},
		dbURI: {
			type: String,
			trim: true,
			unique: true,
			required: true,
		},
		company_name: {
			type: String,
		},
		phone: {
			type: String,
		},
		email: {
			type: String,
		},
		country: {
			type: String,
			default: "my",
		},
		product: {
			type: String,
			default: "nubibot",
		},
		type: {
			type: String,
			enum: ["cloud", "on-premise"],
			default: "cloud",
		},
		full_name: {
			type: String,
		},
		isActive: {
			type: Boolean,
			default: true,
			required: true,
		},
		isExpired: {
			type: Boolean,
			default: false,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: true,
		strict: false,
	}
);

const Tenant = model("Tenant", tenantSchema);
export default Tenant;
