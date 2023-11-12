// import { validateEditUser } from "../../../validators/user.validator.js";
import { errorHelper, logger, getText, ipHelper } from "../../../utils/index.js";
import { uploadFile } from "../../middlewares/index.js";

export default async (req, res) => {
	try {
		logger("00086", req?.user?.id ?? "", getText("en", "00086"), "Info", req);
		const fileLocation = await uploadFile(req.file);
		// returning fileupload location
		return res.status(200).json({
			message: "Upload success",
			code: "00000",
			status: true,
			data: fileLocation,
		});
	} catch (err) {
		return res.status(500).json(errorHelper("00087", req, err.message)).end();
	}
};

/**
 * @swagger
 * /upload/single:
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
 *                  type: string
 *                  format: binary

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
