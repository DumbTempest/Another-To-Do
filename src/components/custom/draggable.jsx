import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export function Draggable({ id, children, onDragStart }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    width: '100%',
    height: '100%',
    cursor: 'grab', // nice visual feedback
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onMouseDown={onDragStart}
      type="button" // prevents form submission if inside a form
    >
      {children}
    </button>
  );
}
