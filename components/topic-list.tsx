"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { TopicItem } from "./topic-item";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export function TopicList() {
  const { topics, darkMode, fetchInitialData, setTopics } = useStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const activeIndex = topics.findIndex((topic) => topic.id === active.id);
      const overIndex = topics.findIndex((topic) => topic.id === over.id);
      if (activeIndex !== -1 && overIndex !== -1) {
        const newTopics = [...topics];
        const [removed] = newTopics.splice(activeIndex, 1);
        newTopics.splice(overIndex, 0, removed);
        setTopics(newTopics);
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <SortableContext
        items={topics.map((topic) => topic.id!).filter(Boolean)}
        strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <TopicItem key={`${topic.id}`} topic={topic} index={index} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
