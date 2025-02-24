"use client";
import React from "react";
import { ChartBarDecreasingIcon, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

import { TopicList } from "@/components/topic-list";
import { AddTopicModal } from "@/components/add-topic";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/store";

export default function Home() {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChartBarDecreasingIcon className="h-6 w-6" />
              <h1 className="text-2xl font-bold">D&D Sheet</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="rounded-full">
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto sm:max-w-7xl px-4 py-8">
        {" "}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {" "}
            <div>
              <h2 className="text-lg font-semibold">Strivers A2Z DSA Sheet</h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                This course is made for people who want to learn DSA from A to Z
                for free in a well organized and structured manner.
              </p>
            </div>
            <div className="md:justify-end">
              {" "}
              <AddTopicModal />
            </div>
          </div>
          <Card className="border rounded-lg shadow-sm">
            <CardContent className="p-4 sm:p-6">
              {" "}
              <TopicList />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
