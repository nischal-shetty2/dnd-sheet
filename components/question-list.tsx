import { useStore } from "@/lib/store";
import { Question } from "@/lib/types";
import { QuestionItem } from "./question-item";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TooltipProvider } from "@radix-ui/react-tooltip";

interface QuestionListProps {
  topicId: string;
  questions: Question[];
}

export function QuestionList({ topicId, questions }: QuestionListProps) {
  const { editQuestion } = useStore();

  // Remove activation constraints to avoid lag; use default sensor config
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;
      const newQuestions = [...questions];
      const activeIndex = newQuestions.findIndex((q) => q.id === activeId);
      const overIndex = newQuestions.findIndex((q) => q.id === overId);
      if (activeIndex !== -1 && overIndex !== -1) {
        const [removed] = newQuestions.splice(activeIndex, 1);
        newQuestions.splice(overIndex, 0, removed);
        editQuestion(topicId, { questions: newQuestions });
      }
    }
  }

  return (
    <div className="relative">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {questions.map((question, index) => (
              <TooltipProvider key={`${question.id}-${index}`}>
                <QuestionItem
                  key={`${question.title}-${index}`}
                  topicId={topicId}
                  question={question}
                />
              </TooltipProvider>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
