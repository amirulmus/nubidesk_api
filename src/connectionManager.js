import { getRequestContext } from "./utils/index.js";
import mongodb from "./loaders/mongoose.js";
import { dbAdmin } from "./config/index.js";

/**
 * Get the tenant db connection.
 */
const getConnectionByTenant = async (tenantName) => {
	try {
		let conn = await mongodb();
		if (dbAdmin === tenantName) {
			const db = conn;
			return db;
		} else {
			const db = conn.useDb(`${tenantName}`, { useCache: true });
			return db;
		}
	} catch (error) {
		console.log("error11", error);
	}
};

/**
 * Get the admin db connection.
 */
const getConnectionByAdmin = async () => {
	try {
		const conn = await mongodb();
		return conn;
	} catch (error) {
		console.log("error11", error);
	}
};

/**
 * Get the connection information (knex instance) for current context. Here we have used a
 * getNamespace from 'continuation-local-storage'. This will let us get / set any
 * information and binds the information to current request context.
 */
const getConnection = () => {
	const conn = getRequestContext("connection");
	if (!conn) {
		throw new Error("Connection is not set for any tenant database");
	}
	return conn;
};

export { getConnectionByAdmin, getConnection, getConnectionByTenant };
