import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Check } from "lucide-react";
import { useState } from "react";

export default function TaskCard({
  task,
  categoryColors,
  setTasks,
  handleEdit,
  darkMode,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const handleDeleteTask = (e) => {
    e.stopPropagation();
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  const handleSaveEdit = (e) => {
    e.stopPropagation();
    if (editText.trim() !== "") {
      handleEdit(task.id, task.category, editText.trim());
      setIsEditing(false);
    }
  };

  const preventDragStart = (e) => e.stopPropagation();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-between gap-3 rounded-xl p-4 shadow-sm text-white cursor-grab hover:cursor-grab transition-all duration-200 ${
        categoryColors[task.category]
      } ${isDragging ? "shadow-lg scale-105" : "hover:shadow-md"}`}
    >
      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className={`w-full px-3 py-2 rounded-md outline-none border-2 text-lg ${
              darkMode
                ? "bg-gray-800 text-white border-white focus:border-blue-400"
                : "bg-white text-black border-black focus:border-blue-600"
            }`}
          />
        ) : (
          <span className="text-lg font-semibold select-none">{task.text}</span>
        )}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {isEditing ? (
          <Button
            variant="outline"
            size="default"
            onClick={handleSaveEdit}
            onPointerDown={preventDragStart}
            onMouseDown={preventDragStart}
            onTouchStart={preventDragStart}
            className="flex items-center justify-center p-2 border-black bg-transparent hover:bg-black"
          >
            <Check className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="default"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            onPointerDown={preventDragStart}
            onMouseDown={preventDragStart}
            onTouchStart={preventDragStart}
            className="flex items-center justify-center p-2 border-black bg-transparent hover:bg-black"
          >
            <Pencil className="w-5 h-5" />
          </Button>
        )}

        <Button
          variant="destructive"
          size="default"
          onClick={handleDeleteTask}
          onPointerDown={preventDragStart}
          onMouseDown={preventDragStart}
          onTouchStart={preventDragStart}
          className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-500"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3096/3096673.png"
            alt="Delete"
            className="w-5 h-5"
            draggable={false}
          />
        </Button>
      </div>
    </div>
  );
}
