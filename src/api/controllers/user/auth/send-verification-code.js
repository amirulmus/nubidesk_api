import { User } from "../../../../models/index.js";
import { validateSendVerificationCode } from "../../../validators/user.validator.js";
import { generateRandomCode, sendCodeToEmail, errorHelper, logger, getText, signConfirmCodeToken } from "../../../../utils/index.js";
import { getConnection } from "../../../../connectionManager.js";

export default async (req, res) => {
	const dbConnection = getConnection();
	const Users = await dbConnection.model("User", User.schema);
	const { error } = validateSendVerificationCode(req.body);
	if (error) return res.status(400).json(errorHelper("00029", req, error.details[0].message));

	const user = await Users.findOne({ email: req.body.email, isActivated: true }).catch((err) => {
		return res.status(500).json(errorHelper("00030", req, err.message));
	});

	if (!user) return res.status(404).json(errorHelper("00036", req));

	const emailCode = generateRandomCode(4);
	await sendCodeToEmail(req.body.email, user.name, emailCode, user.language, "newCode", req, res);

	user.isVerified = false;

	await user.save().catch((err) => {
		return res.status(500).json(errorHelper("00037", req, err.message));
	});

	const confirmCodeToken = signConfirmCodeToken(user._id, emailCode);
	logger("00048", user._id, getText("en", "00048"), "Info", req);
	return res.status(200).json({
		message: getText(req.header("x-nubitel-language"), "00048"),
		code: "00048",
		status: true,
		confirmToken: confirmCodeToken,
	});
};

/**
 * @swagger
 * /user/send-verification-code:
 *    post:
 *      summary: Sends a verification code to the user.
 *      requestBody:
 *        description: Email of the user
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: The code is sent to your email successfully.
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
 *                          confirmToken:
 *                              type: string
 *        "400":
 *          description: Please provide a valid email!
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
