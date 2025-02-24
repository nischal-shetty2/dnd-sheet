"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Edit2Icon,
  GripVertical,
  Star,
  Trash,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Question } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

interface QuestionItemProps {
  topicId: string;
  question: Question;
}

export function QuestionItem({ topicId, question }: QuestionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(question.title);
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { editQuestion, deleteQuestion } = useStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
    disabled: isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle && trimmedTitle !== question.title) {
      editQuestion(topicId, { ...question, title: trimmedTitle }, question.id);
    } else {
      setTitle(question.title); // Reset if empty or unchanged
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setTitle(question.title);
      setIsEditing(false);
    }
  };

  const handleCompletedChange = (checked: boolean) => {
    setIsCompleted(checked);
    editQuestion(topicId, { ...question }, question.id);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteQuestion(topicId, question.id);
    }
  };

  const difficulty = useMemo(() => {
    const difficulties = ["easy", "medium", "hard"];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-50 dark:bg-green-900 text-black dark:text-white";
      case "medium":
        return "bg-yellow-50 dark:bg-yellow-900 text-black dark:text-white";
      case "hard":
        return "bg-red-50 dark:bg-red-900 text-black dark:text-white";
      default:
        return "";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex flex-col sm:flex-row items-center gap-3 rounded-lg border bg-card p-4 text-card-foreground hover:shadow-sm transition-shadow ${
        isDragging ? "opacity-50" : ""
      }`}>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-grab active:cursor-grabbing touch-none"
              {...attributes}
              {...listeners}
              aria-label="Drag to reorder">
              <GripVertical className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className=" text-xs bg-gray-200 rounded-xl dark:text-black mb-2 px-2 py-1">
            Drag to reorder
          </TooltipContent>
        </Tooltip>

        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleCompletedChange}
          aria-label="Mark as completed"
        />
      </div>

      <div className="flex-1 min-w-0 w-full sm:w-auto">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex-1">
            <Input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
              className="w-full"
              aria-label="Edit question title"
            />
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <span
              className={`truncate hover:text-primary transition-colors ${
                isCompleted ? "line-through text-muted-foreground" : ""
              }`}>
              {question.title}
            </span>
            {question.link && (
              <a
                href={question.link}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
        <Badge variant="secondary" className={getDifficultyColor(difficulty)}>
          {difficulty}
        </Badge>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() =>
                  window.open(
                    "https://www.youtube.com/watch?v=10TSKjoglc0",
                    "_blank"
                  )
                }
                variant="ghost"
                size="icon"
                className="shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlSpace="preserve"
                  viewBox="0 0 16 16"
                  id="youtube">
                  <g fillRule="evenodd" clipRule="evenodd">
                    <path
                      fill="#F44336"
                      d="M15.32 4.06c-.434-.772-.905-.914-1.864-.968C12.498 3.027 10.089 3 8.002 3c-2.091 0-4.501.027-5.458.091-.957.055-1.429.196-1.867.969C.23 4.831 0 6.159 0 8.497v.008c0 2.328.23 3.666.677 4.429.438.772.909.912 1.866.977.958.056 3.368.089 5.459.089 2.087 0 4.496-.033 5.455-.088.959-.065 1.43-.205 1.864-.977.451-.763.679-2.101.679-4.429v-.008c0-2.339-.228-3.667-.68-4.438z"></path>
                    <path fill="#FAFAFA" d="M6 11.5v-6l5 3z"></path>
                  </g>
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent className=" text-xs bg-gray-200 rounded-xl dark:text-black mb-2 px-2 py-1">
              Watch solution
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Star className="h-4 w-4 text-yellow-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className=" text-xs bg-gray-200 rounded-xl dark:text-black mb-2 px-2 py-1">
              Add to favorites
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="shrink-0">
                <Edit2Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className=" text-xs bg-gray-200 rounded-xl dark:text-black mb-2 px-2 py-1">
              Edit question
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="shrink-0 text-destructive hover:text-destructive/90">
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className=" text-xs bg-gray-200 rounded-xl dark:text-black mb-2 px-2 py-1">
              Delete question
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
