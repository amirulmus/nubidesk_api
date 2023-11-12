import { Token } from "../../../../models/index.js";
import { errorHelper, getText, logger } from "../../../../utils/index.js";
import { getConnection } from "../../../../connectionManager.js";

export default async (req, res) => {
	const dbConnection = getConnection();
	const Tokens = await dbConnection.model("Token", Token.schema);
	await Tokens.updateOne(
		{ userId: req.user._id },
		{
			$set: { status: false, expiresIn: Date.now() },
		}
	).catch((err) => {
		return res.status(500).json(errorHelper("00049", req, err.message));
	});

	logger("00050", req.user._id, getText("en", "00050"), "Info", req);
	return res.status(200).json({
		message: getText(req.header("x-nubitel-language"), "00050"),
		code: "00050",
		status: true,
	});
};

/**
 * @swagger
 * /user/logout:
 *    post:
 *      summary: Logout the User
 *      security:
 *        - BearerAuth: []
 *        - LanguageAuth: []
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: Successfully logged out.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
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
