# 🚀 TaskFlow: Professional Kanban Board

A modern, full-stack Kanban application built with **Next.js 14 (App Router)**, **Supabase**, and **Optimistic UI** principles. This project mimics real-world SaaS architecture, featuring drag-and-drop task management, dark mode, and persistent database state.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue) ![Supabase](https://img.shields.io/badge/Supabase-Database-green)

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript (Strict Mode)
* **Database:** Supabase (PostgreSQL)
* **State Management:** TanStack Query (React Query)
* **Drag & Drop:** @dnd-kit (Core, Sortable, Modifiers)
* **Styling:** Tailwind CSS & Shadcn UI
* **Theme:** next-themes (Dark/Light Mode)

## ✨ Key Features

* **Drag and Drop:** Smooth sorting between columns using collision detection algorithms.
* **Optimistic UI:** The interface updates instantly while the database saves in the background, ensuring zero latency for the user.
* **Persistence:** Task positions and columns are saved to Supabase, ensuring data remains consistent across reloads.
* **Dark Mode:** Professional light/dark theme toggle using Tailwind.
* **Database Repair:** Built-in utility to automatically seed the database if tables are empty.

---

## 🏗️ Architecture & How It Works

This application solves the classic challenge of syncing **Local Client State** (for smooth animations) with **Server Database State** (for persistence).

### 1. The Data Bridge (ID Normalization)
* **The Challenge:** Supabase uses `BigInt` (Numbers) for IDs for performance, but the UI library (`dnd-kit`) requires `Strings` for draggable keys.
* **The Solution:** A transformation layer in `lib/data/tasks.ts` converts IDs to Strings when fetching, and reverts them to Numbers when mutating (saving) back to the database.

### 2. Optimistic Updates
When a user drags a card:
1.  **Immediate Feedback:** The local React state (`columns`) is updated instantly via `setColumns`.
2.  **Background Sync:** A mutation is fired to Supabase to update the `column_id` and `order_index`.
3.  **Conflict Prevention:** We configured React Query (`staleTime: 0`) to handle data freshness without causing the UI to "snap back" during user interactions.

### 3. Database Schema
The app relies on a relational One-to-Many structure:
* **`columns` table:** Stores board structure (`id`, `title`, `order_index`).
* **`tasks` table:** Stores items (`id`, `title`, `priority`, `progress`, `column_id`).

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Prerequisites
* Node.js 18+ installed.
* A free [Supabase](https://supabase.com/) account.

### 2. Installation

```bash
# Clone the repository
git clone [https://github.com/BANCUNGUYE66/kanban-project.git](https://github.com/BANCUNGUYE66/kanban-project.git)

# Navigate to the project folder
cd kanban-project

# Install dependencies
npm install


# run the development server:

npm run dev

# or

yarn dev

# or

pnpm dev

# or

bun dev



Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
