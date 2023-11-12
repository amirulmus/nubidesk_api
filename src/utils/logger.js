import { Log } from "../models/index.js";
import ipHelper from "./helpers/ip-helper.js";
import { getConnection } from "../connectionManager.js";

export default async (code, userId, errorMessage, level, req) => {
	const dbConnection = getConnection();
	const Logs = await dbConnection.model("Log", Log.schema);

	let ip = "no-ip";
	if (req !== "") ip = ipHelper(req);
	let log = new Logs({
		resultCode: code,
		level: level,
		errorMessage: errorMessage,
		ip: ip,
	});

	if (userId !== "" && userId) log.userId = userId;

	await log.save().catch((err) => {
		console.log("Logging is failed: " + err);
	});
};
