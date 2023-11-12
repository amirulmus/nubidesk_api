// import { validateEditUser } from "../../../validators/user.validator.js";
import { errorHelper, logger, getText, ipHelper } from "../../../utils/index.js";
import { uploadFile } from "../../middlewares/index.js";

export default async (req, res) => {
	if (req.files.length > 0) {
		const promises = req.files.map(async (data, i) => {
			return await uploadFile(data);
		});
		try {
			logger("000000", req?.user?.id ?? "", getText("en", "000000"), "Info", req);
			const payloads = await Promise.all(promises);
			return res.status(200).json({
				message: "Upload success",
				code: "00000",
				status: true,
				data: payloads,
			});
		} catch (err) {
			return res.status(500).json(errorHelper("000000", req, err.message)).end();
		}
	}
};

/**
 * @swagger
 * /upload/multiple:
 *    post:
 *      summary: Upload file
 *      security:
 *        - BearerAuth: []
 *        - LanguageAuth: []
 *      requestBody:
 *        description: All required information about the upload
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: array
 *                  items:
 *                     type: string
 *                     format: binary
 *      tags:
 *        - Upload
 *      responses:
 *        "200":
 *          description: Your upload aws successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              $ref: '#/components/schemas/Message'
 *                          code:
 *                              $ref: '#/components/schemas/Code'
 *                          data:
 *                              type: string
 *        "400":
 *          description: Please provide valid values for each key you want to change.
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
