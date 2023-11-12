import { getConnection } from "../../../connectionManager.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";
import { Tenant } from "../../../models/index.js";

export default async (req, res) => {
	const dbConnection = getConnection();
	const Tenants = await dbConnection.model("Tenant", Tenant.schema);
	const data = await Tenants.find({}).catch((err) => {
		return res.status(500).json(errorHelper("00088", req, err.message));
	});
	logger("00000", "", "Tenant List", "Info", req);
	return res.status(200).json({
		message: "Tenant List",
		code: "00000",
		status: true,
		data: data,
	});
};

/**
 * @swagger
 * /tenant/list:
 *    get:
 *      summary: Get tenant list
 *      tags:
 *        - Tenant
 *      responses:
 *        "200":
 *          description: You list successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              $ref: '#/components/schemas/Message'
 *                          code:
 *                              $ref: '#/components/schemas/Code'
 *                          status:
 *                              default: true
 *                          data:
 *                              type: object
 *        "400":
 *          description: Please provide all the required fields!
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "500":
 *          description: An internal server error occurred, please try again.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 */
