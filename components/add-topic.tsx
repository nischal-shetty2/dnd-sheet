"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "./ui/button";
import { Plus, Link as LinkIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";

const Dialog = dynamic(
  () => import("@/components/ui/dialog").then((mod) => mod.Dialog),
  { ssr: false }
);
const DialogContent = dynamic(
  () => import("@/components/ui/dialog").then((mod) => mod.DialogContent),
  { ssr: false }
);
const DialogFooter = dynamic(
  () => import("@/components/ui/dialog").then((mod) => mod.DialogFooter),
  { ssr: false }
);
const DialogHeader = dynamic(
  () => import("@/components/ui/dialog").then((mod) => mod.DialogHeader),
  { ssr: false }
);
const DialogTitle = dynamic(
  () => import("@/components/ui/dialog").then((mod) => mod.DialogTitle),
  { ssr: false }
);
const DialogTrigger = dynamic(
  () => import("@/components/ui/dialog").then((mod) => mod.DialogTrigger),
  { ssr: false }
);

export const AddTopicModal = () => {
  const { addTopic, addQuestion } = useStore();
  const [topicTitle, setTopicTitle] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionLink, setQuestionLink] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const topicId = crypto.randomUUID();

    // Add topic and its first question
    addTopic(topicTitle, topicId);
    addQuestion(topicId, { title: questionTitle, link: questionLink });

    // Reset form
    setTopicTitle("");
    setQuestionTitle("");
    setQuestionLink("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          New Topic
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-full">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6 flex-1">
            <div className="space-y-2">
              <Label htmlFor="topicTitle">Topic Name</Label>
              <Input
                id="topicTitle"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                placeholder="Enter a name for your topic"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="questionTitle">First Question</Label>
              <Input
                id="questionTitle"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="Add your first question"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="questionLink">Question Link</Label>
              <div className="relative">
                <Input
                  id="questionLink"
                  value={questionLink}
                  onChange={(e) => setQuestionLink(e.target.value)}
                  placeholder="https://"
                  className="w-full pl-9"
                  required
                />
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Topic</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const AddQuestionModal = ({
  topicId,
  isOpen,
  setIsOpen,
}: {
  topicId: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  const { addQuestion } = useStore();
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionLink, setQuestionLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addQuestion(topicId, { title: questionTitle, link: questionLink });
    setQuestionTitle("");
    setQuestionLink("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          <p className=" hidden sm:block">Add Question</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-full">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6 flex-1">
            <div className="space-y-2">
              <Label htmlFor="newQuestionTitle">Question Title</Label>
              <Input
                id="newQuestionTitle"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="Enter your question"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newQuestionLink">Question Link</Label>
              <div className="relative">
                <Input
                  id="newQuestionLink"
                  value={questionLink}
                  onChange={(e) => setQuestionLink(e.target.value)}
                  placeholder="https://"
                  className="w-full pl-9"
                  required
                />
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Question</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
