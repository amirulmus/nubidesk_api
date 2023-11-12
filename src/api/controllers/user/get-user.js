import { User } from "../../../models/index.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";
import { getConnection } from "../../../connectionManager.js";

export default async (req, res) => {
	const dbConnection = getConnection();
	const Users = await dbConnection.model("User", User.schema);
	const user = await Users.findById(req.user._id).catch((err) => {
		return res.status(500).json(errorHelper("00088", req, err.message));
	});

	logger("00089", req.user._id, getText("en", "00089"), "Info", req);
	return res.status(200).json({
		message: getText(req.header("x-nubitel-language"), "00089"),
		code: "00089",
		status: true,
		data: user,
	});
};

/**
 * @swagger
 * /user:
 *    get:
 *      summary: Get User Info
 *      security:
 *        - BearerAuth: []
 *        - LanguageAuth: []
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: The user information has gotten successfully.
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
 *        "401":
 *          description: Invalid token.
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
