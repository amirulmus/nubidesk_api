import { getConnection } from "../../../connectionManager.js";
import { errorHelper, logger, getText, sendCodeToEmail } from "../../../utils/index.js";
import { Tenant } from "../../../models/index.js";
import { dbUri, dbSlug } from "../../../config/index.js";
import { validateCreateTenant } from "../../validators/user.validator.js";

export default async (req, res) => {
	const dbConnection = getConnection();
	const Tenants = await dbConnection.model("Tenant", Tenant.schema);
	const { error } = validateCreateTenant(req.body);
	if (error) {
		let code;
		if (error.details[0].message.includes("slug")) code = "100000";
		return res.status(400).json(errorHelper(code, req, error.details[0].message));
	}

	const slug = req.body.slug;
	const tenantPresent = await Tenants.findOne({
		slug,
	});

	if (tenantPresent) {
		return res.status(400).json(errorHelper("00000", req, "Tenant Already Present"));
	}

	const tenant = await new Tenants({
		slug: `${dbSlug}${slug}`,
		dbURI: `${dbUri}/${dbSlug}${slug}`,
		full_name: req.body.full_name,
		company_name: req.body.company_name,
		phone: req.body.phone,
		email: req.body.email,
		product: req.body.product,
		country: req.body.country,
		type: req.body.type,
	})
		.save()
		.catch((err) => {
			return res.status(500).json(errorHelper("00000", req, err.message));
		});
	logger("00000", req?.user?._id ?? "", "test", "Info", req);
	return res.status(200).json({
		message: "success",
		code: "00000",
		status: true,
		data: tenant,
	});
};

/**
 * @swagger
 * /tenant/create:
 *    post:
 *      summary: Create the new instance tenant
 *      requestBody:
 *        description: All required information about the tenant
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                slug:
 *                  type: string
 *                full_name:
 *                  type: string
 *                company_name:
 *                  type: string
 *                phone:
 *                  type: string
 *                email:
 *                  type: string
 *                type:
 *                  type: string
 *                  enum: ["cloud", "on-premise"]
 *      tags:
 *        - Tenant
 *      responses:
 *        "200":
 *          description: You create successfully.
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
 *        "400":
 *          description: Please provide all the required fields!
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
