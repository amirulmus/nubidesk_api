import { User, Token } from "../../../models/index.js";
import { generateRandomCode, errorHelper, getText, logger } from "../../../utils/index.js";
import bcrypt from "bcryptjs";
const { hash } = bcrypt;
import { getConnection } from "../../../connectionManager.js";

export default async (req, res) => {
	const dbConnection = getConnection();
	const Users = await dbConnection.model("User", User.schema);
	const Tokens = await dbConnection.model("Token", Token.schema);

	const anon = "anon" + generateRandomCode(8);
	const hashed = await hash(anon, 10);
	await Users.updateOne(
		{ _id: req.user._id },
		{
			$set: {
				name: anon,
				username: anon,
				email: anon + "@anon.com",
				password: hashed,
				photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png",
				isActivated: false,
				deletedAt: Date.now(),
			},
		}
	).catch((err) => {
		return res.status(500).json(errorHelper("00090", req, err.message));
	});

	await Tokens.deleteOne({ userId: req.user._id }).catch((err) => {
		return res.status(500).json(errorHelper("00091", req, err.message));
	});

	logger("00092", req.user._id, getText("en", "00092"), "Info", req);
	return res.status(200).json({
		message: getText(req.header("x-nubitel-language"), "00092"),
		code: "00092",
		status: true,
	});
};

/**
 * @swagger
 * /user:
 *    delete:
 *      summary: Delete the User
 *      security:
 *        - BearerAuth: []
 *        - LanguageAuth: []
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: Your account was deleted successfully.
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
