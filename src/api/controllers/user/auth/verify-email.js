import { User, Token } from "../../../../models/index.js";
import { validateVerifyEmail } from "../../../validators/user.validator.js";
import { errorHelper, getText, logger, signAccessToken, signRefreshToken } from "../../../../utils/index.js";
import ipHelper from "../../../../utils/helpers/ip-helper.js";
import { jwtSecretKey } from "../../../../config/index.js";
import pkg from "jsonwebtoken";
const { verify } = pkg;
import { getConnection } from "../../../../connectionManager.js";

export default async (req, res) => {
	const dbConnection = getConnection();
	const Users = await dbConnection.model("User", User.schema);
	const Tokens = await dbConnection.model("Token", Token.schema);

	const { error } = validateVerifyEmail(req.body);
	if (error) return res.status(400).json(errorHelper("00053", req, error.details[0].message));

	try {
		req.user = verify(req.body.token, jwtSecretKey);
	} catch (err) {
		return res.status(400).json(errorHelper("00055", req, err.message));
	}

	const exists = await Users.exists({ _id: req.user._id, isActivated: true }).catch((err) => {
		return res.status(500).json(errorHelper("00051", req, err.message));
	});

	if (!exists) return res.status(400).json(errorHelper("00052", req));

	if (req.body.code !== req.user.code) return res.status(400).json(errorHelper("00054", req));

	await Users.updateOne({ _id: req.user._id }, { $set: { isVerified: true } }).catch((err) => {
		return res.status(500).json(errorHelper("00056", req, err.message));
	});

	const accessToken = signAccessToken(req.user._id);
	const refreshToken = signRefreshToken(req.user._id);
	await Tokens.updateOne(
		{ userId: req.user._id },
		{
			$set: {
				userId: req.user._id,
				refreshToken: refreshToken,
				status: true,
				expires: Date.now() + 604800000,
				createdAt: Date.now(),
				createdByIp: ipHelper(req),
			},
		},
		{
			upsert: true,
		}
	).catch((err) => {
		return res.status(500).json(errorHelper("00057", req, err.message));
	});

	logger("00058", req.user._id, getText("en", "00058"), "Info", req);
	return res.status(200).json({
		message: getText(req.header("x-nubitel-language"), "00058"),
		code: "00058",
		status: true,
		accessToken,
		refreshToken,
	});
};

/**
 * @swagger
 * /user/verify-email:
 *    post:
 *      summary: Verifies the email address of the user.
 *      requestBody:
 *        description: Confirm code and confirm token.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                code:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: Your email address was verified successfully.
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
 *                          accessToken:
 *                              type: string
 *                          refreshToken:
 *                              type: string
 *        "400":
 *          description: Please send a verification code.
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
