import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuestionList } from "./question-list";
import { Topic } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Trash,
  Pencil,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { AddQuestionModal } from "./add-topic";
const MemoizedQuestionList = React.memo(QuestionList);

interface TopicItemProps {
  topic: Topic;
}

export function TopicItem({ topic }: TopicItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState<number | string>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(topic.title);
  const { editTopic, deleteTopic } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: topic.id || topic.title,
    disabled: isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(isExpanded ? contentHeight : 0);
    }
  }, [isExpanded, topic.questions]);

  useEffect(() => {
    if (isDragging) {
      setIsExpanded(false);
      setHeight(0);
    }
  }, [isDragging]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle && trimmedTitle !== topic.title) {
      editTopic(topic.id!, trimmedTitle);
    } else {
      setTitle(topic.title); // Reset to original if empty or unchanged
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setTitle(topic.title);
      setIsEditing(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to delete this topic and all its questions?"
      )
    ) {
      if (topic.id) {
        deleteTopic(topic.id);
      }
    }
  };

  const prevIsOpenRef = useRef(isOpen);

  useEffect(() => {
    if (isOpen !== prevIsOpenRef.current && isExpanded) {
      setIsExpanded(false);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, isExpanded]);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group relative ${
        isDragging ? "opacity-50" : ""
      } w-full transition-shadow hover:shadow-md mb-4`} // Added margin bottom
    >
      <CardHeader className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 md:flex-1">
          <Button
            variant="ghost"
            size="icon"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none"
            aria-label="Drag to reorder">
            <GripVertical className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex-1">
                <Input
                  ref={inputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSubmit}
                  onKeyDown={handleKeyDown}
                  className="w-full"
                  aria-label="Edit topic title"
                />
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-semibold truncate">
                  {topic.title}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Edit topic title">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <span
            className="text-sm sm:text-base text-muted-foreground"
            aria-label={`${topic.completedQuestions} out of ${topic.totalQuestions} questions completed`}>
            {topic.completedQuestions} / {topic.totalQuestions}
          </span>
          <AddQuestionModal
            topicId={topic.id!}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse topic" : "Expand topic"}>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            className="text-destructive hover:text-destructive/90"
            aria-label="Delete topic">
            <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </CardHeader>
      <div
        ref={contentRef}
        style={{ height: typeof height === "number" ? `${height}px` : height }}
        className="overflow-hidden transition-[height] duration-300 ease-in-out">
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <MemoizedQuestionList
            key={`${topic.id}-${isExpanded}`}
            topicId={topic.id!}
            questions={topic.questions}
          />
        </CardContent>
      </div>
    </Card>
  );
}
