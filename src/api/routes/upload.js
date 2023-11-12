import { Router } from "express";
import { single, multiple } from "../controllers/upload/index.js";
import { auth, singleUpload, multipleUpload } from "../middlewares/index.js";

const router = Router();

router.post("/single", auth, singleUpload, single);
router.post("/multiple", auth, multipleUpload, multiple);

export default router;
