"use client";

import { KanbanBoard } from "@/components/KanbanBoard";
import { ModeToggle } from "@/components/mode-toggle";
import { LayoutDashboard, Users, Settings, Bell } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col transition-colors duration-300">
        <div className="p-6">
          <h1 className="text-xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">TaskFlow<span className="text-slate-400">.</span></h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg font-medium cursor-pointer">
            <LayoutDashboard size={20} />
            <span>Board</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
            <Users size={20} />
            <span>Team</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs">AI</div>
            <div className="text-sm">
              <p className="font-medium text-slate-700 dark:text-slate-200">Intern User</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 transition-colors duration-300">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Product Roadmap</h2>
          <div className="flex items-center gap-4">
             <ModeToggle />
             <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bell size={20} />
             </button>
             <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
                Share
             </button>
          </div>
        </header>

        {/* Board Canvas */}
        <div className="flex-1 p-6 overflow-hidden">
          <KanbanBoard initialData={[]} />
        </div>
      </main>
    </div>
  );
}