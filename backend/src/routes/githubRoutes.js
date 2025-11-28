import { Router } from "express";
import { getGitHubData, revalidateGitHub } from "../controllers/githubController.js";

const router = Router();

router.get("/", getGitHubData);
router.post("/revalidate", revalidateGitHub);

export default router;
