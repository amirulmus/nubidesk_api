import { User } from "../../../../models/index.js";
import { validateForgotPassword } from "../../../validators/user.validator.js";
import { errorHelper, getText, logger } from "../../../../utils/index.js";
import bcrypt from "bcryptjs";
import { getConnection } from "../../../../connectionManager.js";

const { hash } = bcrypt;

export default async (req, res) => {
	const dbConnection = getConnection();
	const Users = await dbConnection.model("User", User.schema);
	const { error } = validateForgotPassword(req.body);
	if (error) return res.status(400).json(errorHelper("00066", req, error.details[0].message));

	const hashed = await hash(req.body.password, 10);

	await Users.updateOne({ _id: req.user._id, isVerified: true, isActivated: true }, { $set: { password: hashed } }).catch((err) => {
		return res.status(500).json(errorHelper("00067", req, err.message));
	});

	logger("00068", req.user._id, getText("en", "00068"), "Info", req);
	return res.status(200).json({
		message: getText(req.header("x-nubitel-language"), "00068"),
		code: "00068",
		status: true,
	});
};

/**
 * @swagger
 * /user/forgot-password:
 *    post:
 *      summary: Saves the Password when Forgot
 *      security:
 *        - BearerAuth: []
 *        - LanguageAuth: []
 *      requestBody:
 *        description: New password
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: The new password was created successfully.
 *          content:
 *              application/json:
 *                          message:
 *                              $ref: '#/components/schemas/Message'
 *                          code:
 *                              $ref: '#/components/schemas/Code'
 *                          status:
 *                              default: true
 *                          data:
 *                              type: object
 *        "400":
 *          description: Please provide a password longer than 6, less than 20 characters.
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
