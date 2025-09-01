import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export function Draggable({ id, children, onDragStart }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onMouseDown={onDragStart}
    >
      {children}
    </div>
  );
}
