"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";

export function Droppable({ id, children, style }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
