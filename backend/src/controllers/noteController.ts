import { Request, Response } from "express";
import Note from "../models/Note.js";

export const createNote = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    // Create a new note in the database
    const newNote = new Note({
      content,
      user: req.user!._id,
    });

    await newNote.save();
    return res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Note creation failed", error });
  }
};

// Get all notes for the authenticated user
export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ user: req.user?._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ notes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve notes", error });
  }
};

// Delete a note by ID
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, user: req.user?._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete note", error });
  }
};
