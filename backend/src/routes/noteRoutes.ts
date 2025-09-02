import express from "express";
import { createNote, getNotes, deleteNote } from "../controllers/noteController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";


const router = express.Router();
router.use(verifyJWT);

router.post("/create", createNote);
router.get("/", getNotes);
router.delete("/:id", deleteNote);

export default router;
