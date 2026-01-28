import type React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash } from "lucide-react";
import CustomAlert from "@/components/globals/custom-alert";

interface DraggableAccordionItemProps {
  doc: any;
  id: string;
  index: number;
  removeDocument: (index: number) => void;
  children: React.ReactNode;
}

export function DraggableAccordionItem({
  doc,
  id,
  index,
  removeDocument,
  children,
}: DraggableAccordionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: "relative" as const,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Accordion
        type="single"
        collapsible
        className="w-full border rounded-lg mb-2 "
      >
        <AccordionItem value="item-1" className="border-none">
          <div className="flex items-center">
            <div
              {...attributes}
              {...listeners}
              className="px-2 py-4 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-5 w-5 text-gray-500" />
            </div>
            <AccordionTrigger className="text-lg flex justify-between w-[60vw] font-semibold hover:no-underline">
              <span className="whitespace-nowrap">
                {doc.title || `Document ${index + 1}`}
              </span>
            </AccordionTrigger>
            <CustomAlert
              TriggerComponent={
                <Button
                  size="sm"
                  className="mx-1 rounded-full px-1"
                  type="button"
                  variant="ghost"
                >
                  <Trash className="font-bold text-destructive" />
                </Button>
              }
              alertMessage="Do you want to remove this document requirement?"
              onConfirm={() => removeDocument(index)}
              alertTitle="Delete Document Requirement"
              confirmText="Yes, remove"
            />
          </div>
          <AccordionContent className="p-4">{children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
