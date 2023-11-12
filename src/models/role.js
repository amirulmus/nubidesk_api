import mongoose from "mongoose";
const { Schema, model } = mongoose;

const roleSchema = new Schema(
	{
		name: {
			type: String,
		},
		grant_permission: {
			type: Array,
		},
	},
	{
		versionKey: false,
		timestamps: true,
		strict: false,
	}
);

const Role = model("Role", roleSchema);

export default Role;
