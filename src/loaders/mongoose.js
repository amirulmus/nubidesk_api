import mongoose from "mongoose";
import { dbUri, dbSlug, dbAdmin } from "../config/index.js";

const option = {
	socketTimeoutMS: 30000,
	serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
	family: 4, // Use IPv4, skip trying IPv6
};

export default async () => {
	try {
		const db = await mongoose.createConnection(`${dbUri}/${dbSlug}${dbAdmin}`, option).asPromise();
		mongoose.set("debug", true);
		return db;
	} catch (error) {
		console.log("init db error", error);
	}
};

// const option = {
// socketTimeoutMS: 30000,
// maxPoolSize: 100, // Maintain up to 10 socket connections
// serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
// family: 4, // Use IPv4, skip trying IPv6
// };

// export default (DB_URL) => {
// try {
// 	return mongoose.createConnection(DB_URL, option);
// } catch (error) {
// 	console.log("init db error", error);
// }
// };
