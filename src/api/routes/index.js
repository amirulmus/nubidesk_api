import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import { specs, swaggerConfig } from "../../config/index.js";
import user from "./user.js";
import tenant from "./tenant.js";
import role from "./role.js";
import upload from "./upload.js";
import { resolveTenant, resolveAdmin } from "../middlewares/index.js";

const router = Router();
const specDoc = swaggerJsdoc(swaggerConfig);

router.use(specs, serve);
router.get(specs, setup(specDoc, { explorer: true }));

router.use("/upload", resolveTenant, upload);
router.use("/user", resolveTenant, user);
router.use("/role", resolveTenant, role);
router.use("/tenant", resolveAdmin, tenant);

export default router;
