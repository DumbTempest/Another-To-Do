"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import { Droppable } from "./droppable";
import TaskCard from "./TaskCard";
import { useSession } from "next-auth/react";

export default function Content({ darkMode }) {
  const { data: session } = useSession(); 
  const [tasks, setTasks] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [message, setMessage] = useState("");

  const categories = ["pending", "ongoing", "done"];
  const categoryColors = {
    pending: "bg-red-600",
    ongoing: "bg-yellow-400",
    done: "bg-green-500",
  };

  useEffect(() => {
    const loadTasks = async () => {
      if (!session) return; 
      const res = await fetch("/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      }
    };
    loadTasks();
  }, [session]);

  useEffect(
    () => localStorage.setItem("tasks", JSON.stringify(tasks)),
    [tasks]
  );

  const addTask = () => {
    const text = prompt("Enter new task:")?.trim();
    if (!text) return;
    let category = prompt("Select category: Pending, Ongoing, Done")
      ?.toLowerCase()
      .trim();
    if (!categories.includes(category)) category = "pending";
    setTasks((prev) => [
      ...prev,
      { id: uuidv4(), text, category, done: category === "done" },
    ]);
  };

  const getTasksByCategory = (cat) => tasks.filter((t) => t.category === cat);

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    if (categories.includes(over.id) && activeTask.category !== over.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === active.id
            ? { ...t, category: over.id, done: over.id === "done" }
            : t
        )
      );
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask && activeTask.category !== overTask.category) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === active.id
              ? {
                  ...t,
                  category: overTask.category,
                  done: overTask.category === "done",
                }
              : t
          )
        );
      }
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    if (categories.includes(over.id) && activeTask.category !== over.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === active.id
            ? { ...t, category: over.id, done: over.id === "done" }
            : t
        )
      );
      return;
    }

    const overTask = tasks.find((t) => t.id === over.id);
    if (!overTask || active.id === over.id) return;

    const targetTasks = getTasksByCategory(overTask.category);
    const activeIndex = targetTasks.findIndex((t) => t.id === active.id);
    const overIndex = targetTasks.findIndex((t) => t.id === over.id);
    if (activeIndex === -1 || overIndex === -1) return;

    const reordered = arrayMove(targetTasks, activeIndex, overIndex);
    setTasks((prev) => [
      ...prev.filter((t) => t.category !== overTask.category),
      ...reordered,
    ]);
  };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: undefined })
  );

  const activeTask = tasks.find((t) => t.id === activeId);

  const handleSaveTasks = async () => {
    if (!session) {
      setMessage("Please log in to save tasks");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setMessage("Saving...");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks }),
      });

      if (res.ok) {
        setMessage("Saved!");
        setTimeout(() => setMessage(""), 2000);
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      console.error("Error saving tasks:", error);
      setMessage("Error while saving!");
      setTimeout(() => setMessage(""), 3000);
    }
  };
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      handleSaveTasks();
    }, 30000);
    return () => clearInterval(interval);
  }, [tasks, session]);

  const handleEdit = (id, category, newText) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id && task.category === category
          ? { ...task, text: newText }
          : task
      )
    );
  };
  useEffect(() => {
    if (session && tasks.length > 0) {
      handleSaveTasks();
    }
  }, [tasks, session]);

  return (
    <div
  className={`flex justify-center min-h-screen items-start py-24 px-4 pt-5 transition-colors duration-300 ${
    darkMode ? "bg-black text-white" : "bg-white text-black"
  }`}
>
  <Card
    className={`w-full max-w-6xl h-full min-h-[60vh] h-auto transition-colors duration-300 ${
      darkMode
        ? "bg-gray-900 text-white"
        : "bg-gray-100 text-black border-2 border-solid border-black"
    }`}
  >
    <CardContent>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={addTask}
            className={`flex items-center gap-2 px-3 py-1 font-medium ${
              darkMode
                ? "bg-black text-white border-white"
                : "bg-white text-black border-black"
            }`}
          >
            + Add Task
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleSaveTasks}
            className={`flex items-center gap-2 px-3 py-1 font-medium ${
              darkMode
                ? "bg-slate-700 text-white border-white"
                : "bg-white text-black border-black"
            }`}
          >
            Save All Tasks
          </Button>

          {message && (
            <span
              className={`text-sm ${
                message === "Saved"
                  ? "text-green-500"
                  : message === "Saving.."
                  ? "text-gray-400"
                  : "text-red-500"
              }`}
            >
              {message}
            </span>
          )}
        </div>
      </div>

            <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <SortableContext
              key={cat}
              items={getTasksByCategory(cat).map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <Droppable
                id={cat}
                style={{
                  padding: "12px",
                  border: darkMode
                    ? "2px dashed #fff9f9ff"
                    : "2px dashed #000000",
                  borderRadius: "8px",
                  opacity: 0.8,
                }}
              >
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-center capitalize">
                  {cat}
                </h3>
                <ul className="space-y-2 min-h-[50px]">
                  {getTasksByCategory(cat).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      categoryColors={categoryColors}
                      setTasks={setTasks}
                      handleEdit={handleEdit}
                    />
                  ))}
                </ul>
              </Droppable>
            </SortableContext>
          ))}
        </div>


        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              categoryColors={categoryColors}
              setTasks={setTasks}
              handleEdit={handleEdit}
            />
          )}
        </DragOverlay>
      </DndContext>
    </CardContent>
  </Card>
</div>

  );
}
