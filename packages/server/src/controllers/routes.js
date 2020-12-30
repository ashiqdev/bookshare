import express from "express";
import userRoutes from "./user-controller";
import postsRoutes from "./post-controller";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/posts", postsRoutes);

export default router;
