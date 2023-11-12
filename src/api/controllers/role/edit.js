import { getConnection } from "../../../connectionManager.js";
import { errorHelper, logger, getText, sendCodeToEmail } from "../../../utils/index.js";
import { Role } from "../../../models/index.js";
import { validateUpdateRole } from "../../validators/user.validator.js";

export default async (req, res) => {
	const dbConnection = getConnection();
	const Roles = await dbConnection.model("Role", Role.schema);
	const { error } = validateUpdateRole(req.body);
	if (error) {
		let code;
		if (error.details[0].message.includes("name")) code = "100000";
		else if (error.details[0].message.includes("grant_permission")) code = "100000";
		return res.status(400).json(errorHelper(code, req, error.details[0].message));
	}

	const name = req.body.name;
	await Roles.findOneAndUpdate(
		{ name },
		{
			$set: {
				name,
				grant_permission: req.body.grant_permission,
			},
		},
		{
			new: true,
		}
	).catch((err) => {
		return res.status(500).json(errorHelper("00000", req, err.message));
	});

	const data = await Roles.find({}).catch((err) => {
		return res.status(500).json(errorHelper("00088", req, err.message));
	});

	logger("00000", req?.user?._id ?? "", "test", "Info", req);
	return res.status(200).json({
		message: "Success",
		code: "00000",
		status: true,
		data: data,
	});
};

/**
 * @swagger
 * /role/edit:
 *    post:
 *      security:
 *        - BearerAuth: []
 *        - LanguageAuth: []
 *        - TenantAuth: []
 *      summary: Edit the role
 *      requestBody:
 *        description: All required information about the role
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                grant_permission:
 *                  type: array
 *      tags:
 *        - Role
 *      responses:
 *        "200":
 *          description: You update successfully.
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
