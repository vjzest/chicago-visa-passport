"use client";

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";

const useDnd = (
  fields: IDynamicFormField[],
  onDragEnd: (items: any) => void
) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [items, setItems] = useState<IDynamicFormField[]>(fields);

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active?.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item?.id === active?.id);
      const newIndex = items.findIndex((item) => item?.id === over?.id);
      const reOrderedItems = arrayMove(items, oldIndex, newIndex);
      setItems(reOrderedItems);
      onDragEnd(reOrderedItems);
    }
  }

  function handleDelete(idToDelete: string) {
    setItems((prevItems) =>
      prevItems.filter((item) => item._id !== idToDelete)
    );
  }
  return {
    handleDelete,
    items,
    handleDragEnd,
    sensors,
    setItems,
  };
};

export default useDnd;
