import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuestionList } from "./question-list";
import { Topic } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical, Trash } from "lucide-react";
import { useStore } from "@/lib/store";

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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic.id || topic.title });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(isExpanded ? contentHeight : 0);
    }
  }, [isExpanded, topic.questions]); // Update height when questions change too

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      editTopic(topic.id!, title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isDragging) {
      setIsExpanded(false);
      setHeight(0);
    }
  }, [isDragging]);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-50" : ""}`}>
      <CardHeader className="p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4" />
          </Button>
          <div className="text-nowrap cursor-pointer">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex">
                <Input
                  className="w-fit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSubmit}
                  autoFocus
                />
              </form>
            ) : (
              <div className="flex">
                <h3
                  onClick={() => setIsEditing(true)}
                  className="text-lg font-semibold w-fit">
                  {topic.title}
                </h3>
              </div>
            )}
          </div>
          <div
            className="flex items-center gap-2 w-full justify-end cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}>
            <span className="text-sm text-muted-foreground">
              {topic.completedQuestions} / {topic.totalQuestions}
            </span>
            <Button variant="ghost" size="icon">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                if (topic.id) {
                  deleteTopic(topic.id);
                }
              }}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <div
        ref={contentRef}
        style={{ height: typeof height === "number" ? `${height}px` : height }}
        className="overflow-hidden transition-[height] duration-300 ease-in-out">
        <CardContent className="p-4 pt-0">
          <QuestionList
            key={`${topic.id}`}
            topicId={topic.id!}
            questions={topic.questions}
          />
        </CardContent>
      </div>
    </Card>
  );
}
