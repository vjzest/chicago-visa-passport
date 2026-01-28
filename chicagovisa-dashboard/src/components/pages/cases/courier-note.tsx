import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { courierNotesApi } from "@/services/end-points/end-point";
import NoteBox from "./note-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import { removeHtmlTags } from "@/lib/utils";

interface FormData {
  courierNote: string;
}
type INote = {
  _id: string;
  createdAt: string;
  host: string;
  note: string;
};

const CourierNoteForm = ({
  caseId,
  courierNotes_,
  refetchData,
}: {
  caseId: string;
  courierNotes_: INote[];
  refetchData: () => void;
}) => {
  const { control, handleSubmit, reset, watch } = useForm<FormData>();
  const [isOpen, setIsOpen] = useState(false);
  const [courierNotes, setCourierNotes] = useState<any[]>(courierNotes_);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await courierNotesApi.create(caseId, data);
      // Assuming the API returns the created note, you might want to update the state
      setCourierNotes(
        response?.data?.sort(
          (a: INote, b: INote) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      reset();
    } catch (error) {
      console.error("Error submitting courier note:", error);
    }
  };

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<INote | null>(null);
  const [note, setNote] = useState("");
  const editNote = async () => {
    try {
      const { data } = await axiosInstance.put(
        `/admin/cases/courier-note/${caseId}/${selectedNote?._id}`,
        {
          note,
        }
      );
      if (!data.success) throw new Error(data?.message);
      toast.success("Note edited successfully");
      refetchData();
      setOpenEditModal(false);
      setCourierNotes(
        courierNotes.map((noteItem) =>
          noteItem._id === selectedNote?._id ? { ...noteItem, note } : noteItem
        )
      );
      setNote("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit note");
    }
  };
  const deleteNote = async () => {
    try {
      const { data } = await axiosInstance.delete(
        `/admin/cases/courier-note/${caseId}/${selectedNote?._id}`
      );
      if (!data.success) throw new Error(data?.message);
      toast.success("Note deleted successfully");
      setOpenDeleteModal(false);
      setCourierNotes(
        courierNotes.filter((note) => note._id !== selectedNote?._id) || []
      );
      setSelectedNote(null);
      refetchData();
      setNote("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete note");
    }
  };
  const enteredNote = watch("courierNote");
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger
          className="text-xl font-semibold"
          onClick={() => setIsOpen(!isOpen)}
        >
          Courier Notes
        </AccordionTrigger>
        <AccordionContent>
          {isOpen && (
            <form
              className="space-y-4 w-[90%] py-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="courierNote"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <div className="w-full">
                <Button
                  disabled={removeHtmlTags(enteredNote ?? "")?.trim() === ""}
                  className="w-full"
                  type="submit"
                >
                  Submit Note
                </Button>
              </div>
            </form>
          )}
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

          <div className="mt-4 w-full">
            <h1 className="text-start font-semibold text-lg mb-2">Notes :</h1>
            <div className=" max-h-60 h-fit w-[90%] overflow-y-auto">
              {(courierNotes ?? [])?.length > 0 ? (
                courierNotes?.map((note, index) => (
                  <NoteBox
                    onDeleteClick={() => {
                      setSelectedNote(note);
                      setOpenDeleteModal(true);
                    }}
                    onEditClick={() => {
                      setSelectedNote(note);
                      setOpenEditModal(true);
                      setNote(note.note);
                    }}
                    key={index}
                    content={note}
                  />
                ))
              ) : (
                <p className="text-center text-base text-slate-500">
                  No Notes Found
                </p>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CourierNoteForm;
