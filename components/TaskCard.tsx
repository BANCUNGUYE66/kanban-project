"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanTask } from "@/lib/data/tasks"; 
import { Calendar, UserCircle2 } from "lucide-react"; 

type TaskCardProps = {
  task: KanbanTask;
};

const getPriorityColor = (priority: string | null) => {
    switch (priority) {
        case 'High': return 'text-orange-600 bg-orange-50 border-orange-100 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-300';
        case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300';
        case 'Low': return 'text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400';
        default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
};

export function TaskCard({ task }: TaskCardProps) {
  const sortableId = `task-${task.id}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: sortableId,
    data: { type: "Task", task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 group">
      <Card className={`
        shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border-l-4
        bg-white dark:bg-slate-900 dark:border-slate-800
        ${isDragging ? 'ring-2 ring-blue-400 rotate-2' : 'border-l-transparent hover:border-l-blue-500'}
      `}>
        <CardHeader className="p-4 pb-2 space-y-0">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
              {task.priority || 'NORMAL'}
            </Badge>
          </div>
          <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
            {task.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 pt-2">
          {/* Progress Bar */}
          {task.progress > 0 && task.progress < 100 && (
            <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full mt-2 mb-3 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${task.progress}%` }} />
            </div>
          )}

          <div className="flex items-center justify-between mt-3 text-slate-400">
            <div className="flex items-center text-xs gap-1 hover:text-slate-600 dark:hover:text-slate-300">
                <Calendar size={14} />
                <span>Nov 28</span>
            </div>
            <div className="flex items-center gap-1">
                 <UserCircle2 size={18} className="text-slate-400 hover:text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}