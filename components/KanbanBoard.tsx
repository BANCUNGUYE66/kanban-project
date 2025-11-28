"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useDroppable,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn, KanbanTask, getKanbanData } from "@/lib/data/tasks";
import { TaskCard } from "./TaskCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"; // Ensure you have this: npm install lucide-react

// --- Helpers ---
function getTaskPrefixedId(taskId: string) { return `task-${taskId}`; }
function getColumnPrefixedId(columnId: string) { return `column-${columnId}`; }
function parseTaskId(id: string | number): string | null {
  const s = String(id);
  return s.startsWith("task-") ? s.split("task-")[1] : null;
}
function parseColumnId(id: string | number): string | null {
  const s = String(id);
  return s.startsWith("column-") ? s.split("column-")[1] : null;
}

export function KanbanBoard({ initialData }: { initialData: KanbanColumn[] }) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialData);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const queryClient = useQueryClient();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // 1. Fetch Data
  const { data: fetchedData } = useQuery({
    queryKey: ['kanbanData'],
    queryFn: getKanbanData,
    initialData: initialData,
    staleTime: 0, 
  });

  useEffect(() => {
    if (fetchedData && fetchedData.length > 0) setColumns(fetchedData);
  }, [fetchedData]);

  // 2. Mutations
  const updateTaskMutation = useMutation({
    mutationFn: async (vars: { id: string; column_id: string; order_index: number }) => {
      const numericId = Number(vars.id);
      const numericColumnId = Number(vars.column_id);
      if (isNaN(numericId) || isNaN(numericColumnId)) return;
      await supabase.from('tasks').update({ column_id: numericColumnId, order_index: vars.order_index }).eq('id', numericId);
    },
  });

  const addTaskMutation = useMutation({
    mutationFn: async (vars: { title: string; column_id: string }) => {
      const numericColumnId = Number(vars.column_id);
      const { data, error } = await supabase.from('tasks').insert({
        title: vars.title,
        priority: 'Medium',
        column_id: numericColumnId,
        progress: 0,
        order_index: 999 
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kanbanData'] })
  });

  // 3. Simple Handler (Browser Prompt)
  function handleSimpleAdd(columnId: string) {
    const title = window.prompt("New Task Name:");
    if (!title) return;

    // Optimistic UI Update
    setColumns(prev => prev.map(col => {
        if (col.id === columnId) {
            const tempTask: KanbanTask = {
                id: `temp-${Date.now()}`,
                column_id: columnId,
                title: title,
                priority: 'Medium',
                progress: 0,
                order_index: col.tasks.length
            };
            return { ...col, tasks: [...col.tasks, tempTask] };
        }
        return col;
    }));
    addTaskMutation.mutate({ title, column_id: columnId });
  }

  // --- Drag Logic ---
  function handleDragStart(event: DragStartEvent) {
    const taskId = parseTaskId(event.active.id);
    if (!taskId) return;
    const task = columns.flatMap(c => c.tasks).find(t => t.id === taskId);
    if (task) setActiveTask(task);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeTaskId = parseTaskId(active.id);
    const overTaskId = parseTaskId(over.id);
    const overColumnId = parseColumnId(over.id);
    const activeColumn = columns.find(col => col.tasks.some(t => t.id === activeTaskId));
    let overColumn = columns.find(col => col.tasks.some(t => t.id === overTaskId));
    if (!overColumn && overColumnId) overColumn = columns.find(col => col.id === overColumnId);
    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setColumns((prev) => {
      const activeColIndex = prev.findIndex(c => c.id === activeColumn!.id);
      const overColIndex = prev.findIndex(c => c.id === overColumn!.id);
      const newCols = prev.map(c => ({...c, tasks: [...c.tasks]}));
      const [movedTask] = newCols[activeColIndex].tasks.filter(t => t.id === activeTaskId);
      newCols[activeColIndex].tasks = newCols[activeColIndex].tasks.filter(t => t.id !== activeTaskId);
      movedTask.column_id = overColumn!.id;
      if (overTaskId) {
         const overIndex = newCols[overColIndex].tasks.findIndex(t => t.id === overTaskId);
         newCols[overColIndex].tasks.splice(overIndex, 0, movedTask);
      } else {
         newCols[overColIndex].tasks.push(movedTask);
      }
      return newCols;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeTaskId = parseTaskId(active.id);
    const overTaskId = parseTaskId(over.id);

    if (activeTaskId) {
      const activeColumn = columns.find(c => c.tasks.some(t => t.id === activeTaskId));
      if (activeColumn) {
        let newColumns = [...columns];
        if (overTaskId && activeColumn.tasks.some(t => t.id === overTaskId)) {
             const oldIndex = activeColumn.tasks.findIndex(t => t.id === activeTaskId);
             const newIndex = activeColumn.tasks.findIndex(t => t.id === overTaskId);
             if (oldIndex !== newIndex) {
                 newColumns = columns.map(col => {
                     if (col.id === activeColumn.id) return { ...col, tasks: arrayMove(col.tasks, oldIndex, newIndex) };
                     return col;
                 });
                 setColumns(newColumns);
             }
        }
        const finalColumn = newColumns.find(col => col.tasks.some(t => t.id === activeTaskId));
        if (finalColumn) {
            finalColumn.tasks.forEach((task, index) => {
                updateTaskMutation.mutate({ id: task.id, column_id: finalColumn.id, order_index: index });
            });
        }
      }
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <DroppableColumn key={column.id} column={column}>
            <SortableContext items={column.tasks.map(t => getTaskPrefixedId(t.id))} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col w-[300px] shrink-0">
                  
                  {/* Pro Column Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">{column.title}</h3>
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full font-medium">
                      {column.tasks.length}
                    </span>
                  </div>

                  {/* Pro Column Track */}
                  <div className="flex-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl p-2 border border-slate-200/60 dark:border-slate-700 shadow-inner flex flex-col gap-2">
                    <ScrollArea className="flex-1 h-[calc(100vh-220px)]">
                      <div className="px-1 py-1">
                        {column.tasks.map((task) => (
                          <TaskCard key={task.id} task={task} />
                        ))}
                      </div>
                    </ScrollArea>
                    
                    {/* Pro Add Button */}
                    <Button variant="ghost" className="w-full text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all" onClick={() => handleSimpleAdd(column.id)}>
                      <Plus size={16} className="mr-2" /> Add Task
                    </Button>
                  </div>
                </div>
            </SortableContext>
          </DroppableColumn>
        ))}
      </div>
      <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  );
}

function DroppableColumn({ column, children }: { column: KanbanColumn; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id: getColumnPrefixedId(column.id) });
  return <div ref={setNodeRef} className="h-full">{children}</div>;
}