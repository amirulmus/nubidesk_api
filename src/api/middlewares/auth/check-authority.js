import { User } from "../../../models/index.js";
import { errorHelper } from "../../../utils/index.js";
import { getConnection } from "../../../connectionManager.js";

export async function checkAdmin(req, res, next) {
	const dbConnection = await getConnection();
	const Users = await dbConnection.model("User", User.schema);
	const user = await Users.findById(req.user._id)
		.select("role")
		.catch((err) => {
			return res.status(500).json(errorHelper("00016", req, err.message));
		});

	if (user.role !== "admin") return res.status(403).json(errorHelper("00017", req));

	next();
}

export async function checkSupervisor(req, res, next) {
	const dbConnection = await getConnection();
	const Users = await dbConnection.model("User", User.schema);
	const user = await Users.findById(req.user._id)
		.select("role")
		.catch((err) => {
			return res.status(500).json(errorHelper("00122", req, err.message));
		});
	if (user.role !== "supervisor" && user.role !== "admin") return res.status(403).json(errorHelper("00123", req));

	next();
}

export async function checkAgent(req, res, next) {
	const dbConnection = await getConnection();
	const Users = await dbConnection.model("User", User.schema);
	const user = await Users.findById(req.user._id)
		.select("role")
		.catch((err) => {
			return res.status(500).json(errorHelper("00020", req, err.message));
		});
	if (user.role !== "agent" && user.role !== "supervisor" && user.role !== "admin") return res.status(403).json(errorHelper("00123", req));
	next();
}

export async function checkUser(req, res, next) {
	const dbConnection = await getConnection();
	const Users = await dbConnection.model("User", User.schema);
	const user = await Users.findById(req.user._id)
		.select("role")
		.catch((err) => {
			return res.status(500).json(errorHelper("00018", req, err.message));
		});
	if (user.role !== "user" && user.role !== "agent" && user.role !== "supervisor" && user.role !== "admin") return res.status(403).json(errorHelper("00123", req));
	next();
}
