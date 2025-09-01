"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "./draggable";
import { Droppable } from "./droppable";

export default function Content({ darkMode }) {
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);

  const categories = ["pending", "ongoing", "done"];
  const categoryColors = {
    pending: "bg-red-600",
    ongoing: "bg-yellow-400",
    done: "bg-green-500",
  };

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const text = prompt("Enter new task:");
    if (!text) return;

    let category = prompt("Select category: Pending, Ongoing, Done")?.toLowerCase();
    if (!categories.includes(category)) category = "pending";

    setTasks([
      ...tasks,
      { id: Date.now().toString(), text, category, done: category === "done" },
    ]);
  };

  const toggleTask = (id) => setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  // const archiveTask = (id) => alert("Archive task functionality");
  // const archiveAll = () => alert("Archive all functionality");
  const getTasksByCategory = (cat) => tasks.filter((t) => t.category === cat);
  const handleDragEnd = ({ over }) => {
    if (!over || !draggedTask) return;

    if (categories.includes(over.id)) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === draggedTask.id ? { ...t, category: over.id } : t
        )
      );
    }

    setDraggedTask(null);
  };

  return (
    <div
      className={`flex justify-center min-h-screen
         items-start py-24 px-4 pt-5 transition-colors duration-300
        ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <Card
        className={`w-full max-w-6xl h-full min-h-[60vh] h-auto shadow-xl transition-colors duration-300
          ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black border-2 border-solid border-black"}`}
      >
        <CardContent>
          {/* Top buttons */}
          <div className="mb-6 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={addTask}
              className={`flex items-center gap-2 px-3 py-1 font-medium
                ${darkMode ? "bg-black text-white border-white" : "bg-white text-black border-black"}`}
            >
              + Add Task
            </Button>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={'/'}
                className={`flex items-center gap-2 px-3 py-1 font-medium
                  ${darkMode ? "bg-slate-700 text-white border-white" : "bg-white text-black border-black"}`}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png"
                  alt="Archive All"
                  className="w-5 h-4"
                />
                Archive
              </Button>
            </div>
          </div>

          {/* DnD Context */}
          <DndContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-3 gap-4">
              {categories.map((cat) => {
                const droppableStyle = {
                  minHeight: "50px",
                  padding: "8px",
                  border: darkMode ? "2px dashed #fff9f9ff" : "2px dashed #000000",
                  borderRadius: "8px",
                  opacity: 0.8,
                  transition: "opacity 0.2s, border 0.2s",
                };

                return (
                  <Droppable key={cat} id={cat} style={droppableStyle}>
                    <h3 className="text-xl font-bold mb-2 text-center capitalize">{cat}</h3>
                    <ul className="space-y-2 min-h-[50px]">
                      {getTasksByCategory(cat).map((task) => (
                        <Draggable
                          key={task.id}
                          id={task.id}
                          onDragStart={() => setDraggedTask(task)}
                        >
                          <li
                            className={`flex items-center justify-between rounded-lg p-2 shadow-sm text-white ${categoryColors[cat]}`}
                          >
                            <div className="flex items-center gap-2">
                              {/* <Checkbox
        checked={task.done}
        onCheckedChange={() => toggleTask(task.id)}
        onPointerDown={(e) => e.stopPropagation()} 
      /> */}
                              <span
                                className={`${task.done ? "line-through text-gray-300" : "text-white font-medium"}`}
                              >
                                {task.text}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                // onClick={() => archiveTask(task.id)}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="flex items-center justify-center p-1"
                              >
                                <img
                                  src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png"
                                  alt="Archive"
                                  className="w-5 h-4"
                                />
                              </Button>

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  setTasks((prev) => prev.filter((t) => t.id !== task.id))
                                }
                                onPointerDown={(e) => e.stopPropagation()}
                                className="flex items-center justify-center p-1"
                              >
                                <img
                                  src="https://cdn-icons-png.flaticon.com/512/3096/3096673.png"
                                  alt="Delete"
                                  className="w-5 h-4"
                                />
                              </Button>
                            </div>
                          </li>
                        </Draggable>

                      ))}
                    </ul>
                  </Droppable>
                );
              })}
            </div>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}
