import { Router } from "express";
import { list, edit } from "../controllers/role/index.js";
import { auth } from "../middlewares/index.js";

const router = Router();

router.get("/list", auth, list);
router.post("/edit", auth, edit);

export default router;
