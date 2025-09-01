import { useEffect, useState } from "react";
import { getCurrentUser } from "@/api/auth";
import logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getNotes, createNote, deleteNote } from "@/api/note";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Dashboard() {
  type User = {
    name: string;
    email: string;
  };

  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Array<{ _id: string; content: string }>>(
    []
  );
 
  const [open, setOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await getNotes();
        console.log(response.notes);
        setNotes(response.notes);
      } catch (err) {
        console.error("Failed to fetch notes", err);
      }
    }
    fetchNotes();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    }
    fetchUser();
  }, []);

  const handleCreateNote = async () => {
    if (!noteContent.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }
    try {
      const response = await createNote({ content: noteContent });
      toast.success("Note created successfully");
      setNotes((prev) => [...prev, response.note]);
      setNoteContent("");
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to create note");
      } else {
        toast.error("Failed to create note");
      }
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to delete note");
      } else {
        toast.error("Failed to delete note");
      }
    }
  };
 console.log(notes.map(note => note._id));
  return (
    <div className="h-screen mt-[50px] p-4 flex flex-col items-center">
      {/* Header */}
      <div className="flex w-[343px] md:w-full items-center justify-between mb-8">
        <div className="flex items-center gap-4 md:gap-8">
          <img src={logo} alt="Logo" />
          <h1 className="text-xl md:text-2xl font-medium">Dashboard</h1>
        </div>
        <Link to="/sign-in" className="text-[#367AFF] underline">
          Sign Out
        </Link>
      </div>

      {/* User Card */}
      <Card className="mb-6 w-[343px] md:w-full h-[130px]">
        <CardContent className="p-4 md:p-6 flex flex-col gap-2">
          <h2 className="text-2xl md:text-xl font-bold">
            Welcome, {user?.name || "User"} !
          </h2>
          <p className="text-sm md:text-base text-[#232323]">
            Email: {user?.email || "xxxxxx@xxxx.com"}
          </p>
        </CardContent>
      </Card>

      {/* Create Note Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-[343px] h-[52px] font-semibold text-[16px] mb-6 md:w-full">
            Create Note
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new note</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter note content"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleCreateNote}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes List */}
      <div className="w-[343px] md:w-full">
        <h3 className="text-lg font-semibold mb-4">Notes</h3>
        <div className="flex flex-col gap-3">
          {notes.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-between px-4 py-3">
                <span className="text-lg">No notes available</span>
              </CardContent>
            </Card>
          ) : (
            notes.map((note) => (
              <Card key={note._id}>
                <CardContent className="flex items-center justify-between px-4 py-3">
                  <span className="text-lg">{note.content}</span>
                  <Trash2
                    onClick={() => handleDeleteNote(note._id)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
