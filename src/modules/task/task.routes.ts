import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import * as TaskController from "./task.controller";

const router = Router();

router.use(protect);

router.post("/", TaskController.create);
router.get("/", TaskController.getAll);
router.get("/:id", TaskController.getOne);
router.put("/:id", TaskController.update);
router.patch("/:id", TaskController.update);
router.delete("/:id", TaskController.remove);
router.patch("/:id/toggle", TaskController.toggle);

export default router;