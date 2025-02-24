import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Question, Topic } from "@/lib/types";
import data from "@/lib/data.json";

interface DSAStore {
  topics: Topic[];
  darkMode: boolean;
  fetchInitialData: () => Promise<void>;
  addTopic: (title: string, id: string) => void;
  addQuestion: (topicId: string, question: Omit<Question, "id">) => void;
  editTopic: (id: string, title: string) => void;
  editQuestion: (
    topicId: string,
    update: Partial<Question> | { questions: Question[] },
    questionId?: string
  ) => void;
  deleteTopic: (id: string) => void;
  deleteQuestion: (topicId: string, questionId: string) => void;
  toggleDarkMode: () => void;
  setTopics: (topics: Topic[]) => void;
}

export const useStore = create<DSAStore>()(
  persist(
    (set) => ({
      topics: [],
      darkMode: false,
      fetchInitialData: async () => {
        return new Promise<void>((resolve) => {
          const topicsMap = new Map<string, Question[]>();
          data.data.questions.forEach((question) => {
            if (!topicsMap.has(question.topic)) {
              topicsMap.set(question.topic, []);
            }
            topicsMap.get(question.topic)?.push({
              id: question.questionId.id.toString(),
              link: question.questionId.problemUrl,
              title: question.title,
            });
          });
          const initialTopicsArray = Array.from(topicsMap.entries()).map(
            ([title, initialQuestions]) => ({
              id: crypto.randomUUID(),
              title,
              questions: initialQuestions,
              totalQuestions: initialQuestions.length,
              completedQuestions: 0,
            })
          );
          set({ topics: initialTopicsArray });
          resolve();
        });
      },
      setTopics: (topics: Topic[]) => set({ topics }),
      addTopic: (title, id) =>
        set((state) => ({
          topics: [
            ...state.topics,
            {
              id,
              title,
              questions: [],
              totalQuestions: 0,
              completedQuestions: 0,
            },
          ],
        })),
      addQuestion: (topicId, question) =>
        set((state) => {
          const topicIndex = state.topics.findIndex((t) => t.id === topicId);
          if (topicIndex === -1) return state;
          const newTopics = [...state.topics];
          newTopics[topicIndex].questions.push({
            ...question,
            id: crypto.randomUUID(),
          });
          newTopics[topicIndex].totalQuestions++;
          return { topics: newTopics };
        }),
      editTopic: (id, title) =>
        set((state) => ({
          topics: state.topics.map((t) => (t.id === id ? { ...t, title } : t)),
        })),
      editQuestion: (topicId, update, questionId) => {
        set((state) => ({
          topics: state.topics.map((topic) => {
            if (topic.id === topicId) {
              if ("questions" in update) {
                // Handle full array update (reordering)
                return {
                  ...topic,
                  questions: update.questions as Question[],
                };
              }
              // Handle single question update
              return {
                ...topic,
                questions: topic.questions.map((q) =>
                  q.id === questionId ? { ...q, ...update } : q
                ),
              };
            }
            return topic;
          }),
        }));
      },
      deleteTopic: (id) =>
        set((state) => ({
          topics: state.topics.filter((t) => t.id !== id),
        })),
      deleteQuestion: (topicId, questionId) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === topicId
              ? {
                  ...t,
                  questions: t.questions.filter((q) => q.id !== questionId),
                  totalQuestions: t.totalQuestions - 1,
                }
              : t
          ),
        })),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: "dsa-store",
    }
  )
);
