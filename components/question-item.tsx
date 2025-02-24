// question-item.tsx
"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Edit2Icon,
  GripVertical,
  Star,
  Trash,
  Youtube,
} from "lucide-react";

import { useStore } from "@/lib/store";
import { Question } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface QuestionItemProps {
  topicId: string;
  question: Question;
}

export function QuestionItem({ topicId, question }: QuestionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(question.title);
  const { editQuestion, deleteQuestion } = useStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      editQuestion(topicId, { title }, question.id);
      setIsEditing(false);
    }
  };
  // State for tracking completion locally
  const [isCompleted, setIsCompleted] = useState(false); // Initialize from props
  const difficulty = useMemo(() => {
    const random = Math.random();
    return random > 0.6 ? "Medium" : random > 0.3 ? "Hard" : "Easy";
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-lg border bg-card p-3 text-card-foreground ${
        isDragging ? "opacity-50" : ""
      }`}>
      <Button
        variant="ghost"
        size="icon"
        className="cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}>
        <GripVertical className="h-4 w-4" />
      </Button>
      <Checkbox
        checked={isCompleted} // Use local state
        onCheckedChange={(checked) => setIsCompleted(checked === true)} // Update local state
      />
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSubmit}
            className=" max-w-fit"
            autoFocus
          />
        </form>
      ) : (
        <div
          onClick={() => window.open(question.link, "_blank")}
          className="flex-1 cursor-pointer">
          <span
            className={`max-w-fit hover:underline ${
              isCompleted ? "line-through" : ""
            }`}>
            {title.length > 20 ? `${title.substring(0, 20)}...` : title}
          </span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Badge variant={"secondary"}>{difficulty}</Badge>
        <Badge key={question.id} variant="outline">
          {question.title.split(" ")[0]}
        </Badge>
        <Button variant="ghost" size="icon">
          <Youtube className="h-4 w-4 text-red-500" />
        </Button>
        <Button variant="ghost" size="icon">
          <Star className="h-4 w-4" />
        </Button>
        <Edit2Icon
          className="cursor-pointer"
          size={15}
          onClick={() => setIsEditing(true)}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteQuestion(topicId, question.id)}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
