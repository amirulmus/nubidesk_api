import { Token } from "../../../../models/index.js";
import { validateRefreshToken } from "../../../validators/user.validator.js";
import { errorHelper, getText, ipHelper, signAccessToken, signRefreshToken } from "../../../../utils/index.js";
import { refreshTokenSecretKey } from "../../../../config/index.js";
import pkg from "jsonwebtoken";
const { verify } = pkg;
import { getConnection } from "../../../../connectionManager.js";

export default async (req, res) => {
	const dbConnection = getConnection();
	const Tokens = await dbConnection.model("Token", Token.schema);
	const { error } = validateRefreshToken(req.body);
	if (error) return res.status(400).json(errorHelper("00059", req, error.details[0].message));

	try {
		req.user = verify(req.body.refreshToken, refreshTokenSecretKey);
	} catch (err) {
		return res.status(400).json(errorHelper("00063", req, err.message));
	}

	const userToken = await Tokens.findOne({ userId: req.user._id }).catch((err) => {
		return res.status(500).json(errorHelper("00060", req, err.message));
	});

	if (userToken.refreshToken !== req.body.refreshToken || !userToken) return res.status(404).json(errorHelper("00061", req));

	if (userToken.expiresIn <= Date.now() || !userToken.status) return res.status(400).json(errorHelper("00062", req));

	const accessToken = signAccessToken(req.user._id);
	const refreshToken = signRefreshToken(req.user._id);

	await Tokens.updateOne(
		{ userId: req.user._id },
		{
			$set: {
				refreshToken: refreshToken,
				createdByIp: ipHelper(req),
				createdAt: Date.now(),
				expires: Date.now() + 604800000,
				status: true,
			},
		}
	).catch((err) => {
		return res.status(500).json(errorHelper("00064", req, err.message));
	});

	return res.status(200).json({
		message: getText(req.header("x-nubitel-language"), "00065"),
		code: "00065",
		status: true,
		accessToken,
		refreshToken,
	});
};

/**
 * @swagger
 * /user/refresh-token:
 *    post:
 *      summary: Refreshes the Access Token
 *      requestBody:
 *        description: Valid Refresh Token
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                refreshToken:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: The token is refreshed successfully.
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
 *          description: Please provide refresh token.
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
