import { getConnection } from "../../../connectionManager.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";
import { Role } from "../../../models/index.js";

export default async (req, res) => {
	const dbConnection = getConnection();
	const Roles = await dbConnection.model("Role", Role.schema);
	var data = await Roles.find({}).catch((err) => {
		return res.status(500).json(errorHelper("00088", req, err.message));
	});

	if (!data.length) {
		data = await Roles.insertMany([
			{
				name: "admin",
				grant_permission: [],
			},
			{
				name: "supervisor",
				grant_permission: [],
			},
			{
				name: "agent",
				grant_permission: [],
			},
			{
				name: "user",
				grant_permission: [],
			},
		]).catch((err) => {
			return res.status(500).json(errorHelper("00000", req, err.message));
		});
	}
	// console.log(!list.length);
	logger("00000", "", "Role List", "Info", req);
	return res.status(200).json({
		message: "Role List",
		code: "00000",
		status: true,
		data: data,
	});
};

/**
 * @swagger
 * /role/list:
 *    get:
 *      security:
 *        - BearerAuth: []
 *        - LanguageAuth: []
 *        - TenantAuth: []
 *      summary: Get role list
 *      tags:
 *        - Role
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
