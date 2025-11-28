import { supabase } from '@/lib/supabase';

export type KanbanTask = {
  id: string; 
  column_id: string;
  title: string;
  priority: string | null;
  progress: number;
  order_index: number;
};

export type KanbanColumn = {
  id: string;
  title: string;
  order_index: number;
  tasks: KanbanTask[];
};

export async function getKanbanData(): Promise<KanbanColumn[]> {
  console.log("⚡ Fetching Columns...");
  const { data: colsData, error: colsError } = await supabase
    .from('columns')
    .select('*')
    .order('order_index');

  if (colsError) {
    console.error("❌ Column Error:", colsError);
    return [];
  }
  
  if (!colsData || colsData.length === 0) {
      console.warn("⚠️ No columns found in DB");
      return [];
  }

  console.log("⚡ Fetching Tasks...");
  const { data: tasksData, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .order('order_index');

  if (tasksError) {
    console.error("❌ Task Error:", tasksError);
    return [];
  }

  console.log(`✅ Found ${colsData.length} columns and ${tasksData?.length} tasks`);

  const columns = colsData.map((col: any) => ({
    id: String(col.id),
    title: col.title,
    order_index: col.order_index,
    tasks: tasksData
      ? tasksData
          .filter((task: any) => task.column_id === col.id)
          .map((task: any) => ({
            id: String(task.id),
            column_id: String(task.column_id),
            title: task.title,
            priority: task.priority,
            progress: task.progress || 0,
            order_index: task.order_index,
          }))
      : [],
  }));

  return columns;
}