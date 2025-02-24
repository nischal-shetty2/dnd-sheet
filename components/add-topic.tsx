"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
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
// Removed unused DialogDescription import
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
  const [newTopicId, setNewTopicId] = useState<string | null>(null); // Store the new topic ID

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Add the topic first
    const topicId = crypto.randomUUID(); // Generate ID here
    addTopic(topicTitle, topicId); // Pass the generated ID
    setNewTopicId(topicId); //Store the new topic ID so we can add question to it.

    // 2. Then, add the question using the new topicId
    if (newTopicId) {
      addQuestion(newTopicId, { title: questionTitle, link: questionLink });
    }
    addQuestion(topicId, { title: questionTitle, link: questionLink });
    setQuestionLink("");
    setIsOpen(false);
    setNewTopicId(null); // Reset for the next topic
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Topic
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Enter Topic and Question Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topicTitle">Topic Title</Label>
              <Input
                id="topicTitle"
                type="text"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                placeholder="Enter topic title"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="questionTitle">Question Title</Label>
              <Input
                id="questionTitle"
                type="text"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="Enter question title"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="questionLink">Question Link</Label>
              <Input
                id="questionLink"
                type="text"
                value={questionLink}
                onChange={(e) => setQuestionLink(e.target.value)}
                placeholder="Enter question link"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const AddQuestionModal = ({ topicId }: { topicId: string }) => {
  const { addQuestion } = useStore();
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionLink, setQuestionLink] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Question
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Enter Question Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="questionTitle">Question Title</Label>
              <Input
                id="questionTitle"
                type="text"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="Enter question title"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="questionLink">Question Link</Label>
              <Input
                id="questionLink"
                type="text"
                value={questionLink}
                onChange={(e) => setQuestionLink(e.target.value)}
                placeholder="Enter question link"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
