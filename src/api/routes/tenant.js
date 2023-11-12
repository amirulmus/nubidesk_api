import { Router } from "express";
import { create, list } from "../controllers/tenant/index.js";

const router = Router();

router.post("/create", create);
router.get("/list", list);

export default router;
