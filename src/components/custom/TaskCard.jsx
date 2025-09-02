import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({ task, categoryColors, setTasks }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const handleDeleteTask = (e) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== task.id));
  };

  const handleArchiveTask = (e) => {
    e.stopPropagation();
    console.log("Archive task:", task.id);
  };

  const preventDragStart = (e) => e.stopPropagation();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-between rounded-lg p-2 shadow-sm text-white cursor-grab hover:cursor-grab transition-all duration-200 ${categoryColors[task.category]} ${isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-white font-medium select-none">{task.text}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleArchiveTask} onPointerDown={preventDragStart} onMouseDown={preventDragStart} onTouchStart={preventDragStart} className="flex items-center justify-center p-1 bg-white border-white/20 hover:bg-white/20 transition-colors">
          <img src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png" alt="Archive" className="w-4 h-4" draggable={false} />
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDeleteTask} onPointerDown={preventDragStart} onMouseDown={preventDragStart} onTouchStart={preventDragStart} className="flex items-center justify-center p-1 bg-red-600 hover:bg-red-500 transition-colors">
          <img src="https://cdn-icons-png.flaticon.com/512/3096/3096673.png" alt="Delete" className="w-4 h-4" draggable={false} />
        </Button>
      </div>
    </div>
  );
}
