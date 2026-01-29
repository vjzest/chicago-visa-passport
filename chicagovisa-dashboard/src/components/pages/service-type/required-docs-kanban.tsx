import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ReactQuill from "react-quill";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { DraggableAccordionItem } from "./draggable-accordion-item";
import { formatName } from "@/lib/utils";

interface RequiredDoc {
  _id: string;
  title: string;
  key: string;
  instruction: string;
  sampleImage: File | string | null;
  attachment: File | string | null;
  isRequired: boolean;
}

interface RequiredDocsKanbanProps {
  requiredDocs: RequiredDoc[];
  updateTitle: (index: number, title: string) => void;
  updateInstruction: (index: number, instruction: string) => void;
  updateIsRequired: (index: number, bool: boolean) => void;
  removeDocument: (index: number) => void;
  handleSampleImageChange: (index: number, file: File | null) => void;
  addDocument: () => void;
  reorderDocuments: (oldIndex: number, newIndex: number) => void;
}

export default function RequiredDocsKanban({
  requiredDocs,
  updateTitle,
  updateInstruction,
  updateIsRequired,
  handleSampleImageChange,
  removeDocument,
  addDocument,
  reorderDocuments,
}: RequiredDocsKanbanProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = requiredDocs.findIndex(
        (doc) => `doc-${doc._id}` === active.id
      );
      const newIndex = requiredDocs.findIndex(
        (doc) => `doc-${doc._id}` === over.id
      );
      reorderDocuments(oldIndex, newIndex);
    }
  };

  return (
    <div className="mt-3 flex flex-col gap-3 md:w-4/5">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={requiredDocs.map((doc) => `doc-${doc._id}`)}
          strategy={verticalListSortingStrategy}
        >
          {requiredDocs?.map((doc, index) => (
            <DraggableAccordionItem
              key={`doc-${doc._id}`}
              id={`doc-${doc._id}`}
              index={index}
              doc={doc}
              removeDocument={removeDocument}
            >
              <div className="flex flex-col gap-3">
                <Input
                  placeholder={`Enter Title for Doc ${index + 1}`}
                  value={doc.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    const formattedName = formatName(value, {
                      allowNumbers: true,
                      allowNonConsecutiveSpaces: true,
                      allowUppercaseInBetween: true,
                      makeLettersAfterSpaceCapital: false,
                      allowSpecialCharacters: true,
                    });
                    updateTitle(index, formattedName);
                  }}
                />
                <div className="h-[18rem]">
                  <ReactQuill
                    className="md:w-full h-[15rem]"
                    value={doc.instruction}
                    onChange={(value) => {
                      updateInstruction(index, value);
                    }}
                    modules={{
                      toolbar: [
                        ["bold", "italic", "underline", "strike"],
                        [{ color: [] }],
                        ["clean"],
                        ["link"],
                        [{ list: "ordered" }, { list: "bullet" }],
                      ],
                    }}
                  />
                </div>
                <div className="flex gap-3 items-center justify-start">
                  <Checkbox
                    id={doc.title + "isRequired"}
                    checked={doc.isRequired}
                    onCheckedChange={(checked) => {
                      updateIsRequired(index, checked ? true : false);
                    }}
                  />
                  <Label htmlFor={doc.title + "isRequired"} className="text-sm">
                    Is Required
                  </Label>
                </div>
                <div>
                  <Label htmlFor={`sampleImage-${index}`}>Sample Image</Label>
                  {doc.sampleImage && typeof doc?.sampleImage === "string" && (
                    <Image
                      alt="image"
                      src={doc.sampleImage || "/placeholder.svg"}
                      height={200}
                      width={200}
                    />
                  )}
                  <Input
                    id={`sampleImage-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        handleSampleImageChange(index, file);
                      } else {
                        handleSampleImageChange(index, null);
                      }
                    }}
                  />
                  {doc.sampleImage && (
                    <div className="mt-2 flex items-center gap-4">
                      {doc.sampleImage instanceof File ? (
                        <Image
                          src={
                            URL.createObjectURL(doc.sampleImage) ||
                            "/placeholder.svg"
                          }
                          alt={`Sample for ${doc.title}`}
                          width={100}
                          height={100}
                          className="max-h-32 object-contain"
                        />
                      ) : (
                        <Image
                          src={doc.sampleImage || "/placeholder.svg"}
                          alt={`Sample for ${doc.title}`}
                          width={100}
                          height={100}
                          className="max-h-32 object-contain"
                        />
                      )}
                      <Button
                        size="sm"
                        className="mt-1"
                        type="button"
                        variant="destructive"
                        onClick={() => handleSampleImageChange(index, null)}
                      >
                        <Trash2 color="white" size="1rem" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </DraggableAccordionItem>
          ))}
        </SortableContext>
      </DndContext>
      <Button className="ml-auto w-fit" type="button" onClick={addDocument}>
        Add Doc
      </Button>
    </div>
  );
}
