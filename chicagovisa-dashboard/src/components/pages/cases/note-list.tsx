import React, { useState } from "react";
import NoteBox from "./note-card";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactQuill from "react-quill";
import { Button } from "@/components/ui/button";
import { removeHtmlTags } from "@/lib/utils";

type INote = {
  _id: string;
  createdAt: string;
  host: string;
  autoNote: string;
  manualNote: string;
};

const NotesList: React.FC<{
  group: "cases" | "applications";
  groupId: string;
  notes: INote[];
  setEditedNote: (note: string) => void;
}> = ({ notes, group, groupId, setEditedNote }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<INote | null>(null);
  const [note, setNote] = useState("");
  const editNote = async () => {
    try {
      const { data } = await axiosInstance.put(
        `/admin/${group}/note/${groupId}/${selectedNote?._id}`,
        {
          note,
        }
      );
      if (!data.success) throw new Error(data?.message);
      toast.success("Note edited successfully");
      setEditedNote(note);
      setOpenEditModal(false);
      setNote("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit note");
    }
  };
  const deleteNote = async () => {
    try {
      const { data } = await axiosInstance.delete(
        `/admin/${group}/note/${groupId}/${selectedNote?._id}`
      );
      if (!data.success) throw new Error(data?.message);
      toast.success("Note deleted successfully");
      setOpenDeleteModal(false);
      setSelectedNote(null);
      setEditedNote("");
      setNote("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete note");
    }
  };
  return (
    <div>
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent>
          <DialogTitle>Edit note</DialogTitle>
          <div className="flex gap-2">
            <ReactQuill
              className="mb-8"
              value={note}
              onChange={(val) => setNote(val)}
            />
            <div className="flex flex-col justify-end gap-4 mt-2">
              <Button
                size={"xsm"}
                variant={"outline"}
                onClick={() => {
                  setNote("");
                  setOpenEditModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={removeHtmlTags(note)?.trim() === ""}
                size={"xsm"}
                onClick={editNote}
              >
                Edit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent>
          <DialogTitle>Delete note</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this note?
          </DialogDescription>
          <div className="flex gap-2 justify-end w-full">
            <Button
              variant={"outline"}
              size={"xsm"}
              onClick={() => {
                setOpenDeleteModal(false);
              }}
            >
              Cancel
            </Button>
            <Button size={"xsm"} onClick={deleteNote}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {notes?.map((note, index) => (
        <React.Fragment key={index}>
          <NoteBox
            onDeleteClick={() => {}}
            onEditClick={() => {}}
            content={{
              _id: note._id,
              note: note.autoNote,
              createdAt: note.createdAt,
              host: note.host,
              isAutoNote: true,
            }}
          />

          {note?.manualNote && (
            <NoteBox
              onEditClick={() => {
                setSelectedNote(note);
                setNote(note.manualNote);
                setOpenEditModal(true);
              }}
              onDeleteClick={() => {
                setSelectedNote(note);
                setNote(note.manualNote);
                setOpenDeleteModal(true);
              }}
              content={{
                _id: note._id,
                note: note.manualNote,
                createdAt: note.createdAt,
                host: note.host,
                isAutoNote: false,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NotesList;
