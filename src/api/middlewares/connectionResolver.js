import { Tenant } from "../../models/index.js";
import { getConnectionByTenant, getConnectionByAdmin } from "../../connectionManager.js";
import { errorHelper, createRequestContext } from "../../utils/index.js";
import { dbAdmin } from "../../config/index.js";

/**
 * Get the connection instance for the given tenant's name and set it to the current context.
 */
const resolveTenant = async (req, res, next) => {
	const tenant = req.headers["x-nubitel-tenant"];
	if (!tenant) {
		return res.status(500).json(errorHelper("00000", req, "Please provide tenant's name in `[x-nubitel-tenant]` to connect"));
	}

	if (dbAdmin !== tenant) {
		const db = await getConnectionByAdmin();
		const Tenants = db.model("Tenant", Tenant.schema);
		const tenantPresent = await Tenants.findOne({
			slug: tenant,
		});
		if (!tenantPresent) {
			return res.status(500).json(errorHelper("00000", req, "Tenant name is invalid"));
		}

		if (!tenantPresent.isActive) {
			return res.status(500).json(errorHelper("00000", req, "Tenant is not active"));
		}

		if (!!tenantPresent.isExpired) {
			return res.status(500).json(errorHelper("00000", req, "Tenant is expired"));
		}
	}

	try {
		const tenantDbConnection = await getConnectionByTenant(tenant);
		createRequestContext(tenantDbConnection, "connection");
		next();
	} catch (error) {
		console.log("resolveTenant", error);
	}
};

/**
 * Get the admin db connection instance and set it to the current context.
 */
const resolveAdmin = async (req, res, next) => {
	try {
		const adminDbConnection = await getConnectionByAdmin();
		createRequestContext(adminDbConnection, "connection");
		next();
	} catch (error) {
		console.log("resolveAdmin", error);
	}
};

export { resolveTenant, resolveAdmin };
