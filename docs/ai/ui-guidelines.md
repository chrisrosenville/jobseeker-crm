# 🎨 Job-Seeker CRM – UI/UX Design Guidelines

This document defines the **visual style and UX rules** for the Job-Seeker CRM.  
All components, pages, and interactions should follow these principles to ensure a **consistent, professional SaaS look**.

---

## ✨ Design Philosophy

- **Clarity first** → Prioritize readability and ease of use
- **Consistency** → Reuse patterns, don’t reinvent components
- **Modern SaaS style** → Inspired by Linear, Notion, Vercel
- **Accessible** → Support light/dark mode, high contrast, keyboard nav
- **Responsive** → Optimized for desktop first, fluid on mobile

---

## 🎨 Color Palette

| Use Case           | Light Mode             | Dark Mode              |
| ------------------ | ---------------------- | ---------------------- |
| **Background**     | `#f9fafb` (gray-50)    | `#0f1115` (gray-950)   |
| **Surface/Card**   | `#ffffff`              | `#1c1f26`              |
| **Borders**        | `#e5e7eb` (gray-200)   | `#2a2f3a`              |
| **Text Primary**   | `#111827` (gray-900)   | `#f9fafb` (gray-50)    |
| **Text Secondary** | `#6b7280` (gray-500)   | `#9ca3af` (gray-400)   |
| **Accent**         | `#3b82f6` (blue-500)   | `#60a5fa` (blue-400)   |
| **Success**        | `#10b981` (green-500)  | `#34d399` (green-400)  |
| **Warning**        | `#f59e0b` (amber-500)  | `#fbbf24` (amber-400)  |
| **Info**           | `#6366f1` (indigo-500) | `#818cf8` (indigo-400) |
| **Danger**         | `#ef4444` (red-500)    | `#f87171` (red-400)    |

> Status colors should be used for **job stages** in the Kanban board and analytics.

---

## 🖋️ Typography

- **Headings**
  - Page titles → `text-2xl md:text-3xl font-bold tracking-tight`
  - Section titles → `text-xl font-bold`
- **Body text**
  - `text-sm md:text-base font-normal`
- **Muted text**
  - `text-gray-500 dark:text-gray-400`
- **Font stack**
  - System UI sans-serif (`Inter`, `ui-sans-serif`, etc.)

---

## 🧩 Components

### Buttons

- Use `shadcn/ui` Button
- Styles:
  - **Primary** → `bg-blue-500 text-white hover:bg-blue-600`
  - **Secondary** → `bg-gray-100 dark:bg-gray-800`
  - **Destructive** → `bg-red-500 text-white hover:bg-red-600`
- Shape → `rounded-xl`, subtle `shadow-sm`

### Cards

- Rounded corners → `rounded-xl`
- Shadow → `shadow-sm`
- Padding → `p-4 md:p-6`
- Layout → Title + subtitle on top, content below

### Forms

- Use `shadcn/ui` Form + Input
- Full-width inputs, labeled clearly
- Inline error messages in red
- Submit actions → primary button
- Feedback → toast on success/error

### Tables

- Use `shadcn/ui` Table
- Alternating row colors for readability
- Inline action buttons (edit/delete) with icons

### Modals / Drawers

- **Modal** → centered for important forms (e.g., "Add Job")
- **Drawer** → right-side slide for quick edits

### Toasts

- Use `shadcn/ui` Toast
- Success → green
- Error → red
- Auto-dismiss after 3s, closable

---

## 📊 Analytics

- Use **Recharts** for data viz
- Supported chart types:
  - Bar ch
