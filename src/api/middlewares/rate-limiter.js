import { RateLimiterMongo } from "rate-limiter-flexible";
import { errorHelper } from "../../utils/index.js";
import { getConnectionByTenant, getConnectionByAdmin } from "../../connectionManager.js";

export default async (req, res, next) => {
	let mongoConn;
	const tenant = req.headers["x-nubitel-tenant"];
	if (tenant) {
		mongoConn = await getConnectionByTenant(tenant);
	} else {
		mongoConn = await getConnectionByAdmin();
	}

	const opts = {
		storeClient: mongoConn,
		tableName: "rateLimits",
		points: 100, // x requests
		duration: 10, // per y second by IP
	};

	const rateLimiterMongo = new RateLimiterMongo(opts);
	rateLimiterMongo
		.consume(req.ip)
		.then(() => {
			next();
		})
		.catch((err) => {
			return res.status(429).json(errorHelper("00024", req, err.message));
		});
};
