import express from "express";
import { getAllUsers, toggleUserStatus } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/users", getAllUsers);
adminRouter.put("/toggle/:userId", toggleUserStatus);

export default adminRouter;