import logger from "../logger.js";
import { getText } from "../../utils/index.js";

export default (code, req, errorMessage) => {
	//NOTE: This control routes every server error to the same lang key.
	let lang = req.header("x-nubitel-language");
	let key = code;
	let msg = getText(lang, code) ? getText(lang, code) : errorMessage;

	if (!msg) key = "00008";

	let userId = "";
	if (req && req.user && req.user._id) userId = req.user._id;

	if (msg.includes("server error")) {
		logger(code, userId, errorMessage, "Server Error", req);
	} else {
		logger(code, userId, errorMessage ?? msg, "Client Error", req);
	}
	return {
		message: msg,
		code: code,
		status: false,
	};
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Result:
 *       type: object
 *       properties:
 *         message:
 *           $ref: '#/components/schemas/Message'
 *         code:
 *           $ref: '#/components/schemas/Code'
 *         status:
 *           $ref: '#/components/schemas/Status'
 *     Message:
 *       type: string
 *     Code:
 *       type: string
 *       enum: ["200", "400", "500"]
 *     Status:
 *       type: boolean
 *       default: false
 *     Data:
 *       type: object
 */
