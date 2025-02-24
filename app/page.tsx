"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { TopicList } from "@/components/topic-list";
import { AddTopicModal } from "@/components/add-topic";

export default function Home() {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <>
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">DND Sheet</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={toggleDarkMode}>
                {darkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <AddTopicModal />
            </div>
          </div>
          <TopicList />
        </div>
      </div>
    </>
  );
}
