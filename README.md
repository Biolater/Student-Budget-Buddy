
<h1 align="center">🧠 Student Budget Buddy</h1>
<p align="center"><i>Track smarter. Save better. A student-focused budgeting app powered by modern tech and AI.</i></p>

<p align="center">
  <img src="./banner.png" alt="Student Budget Buddy Banner" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-blue?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat-square&logo=postgresql" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Clerk-Auth-orange?style=flat-square&logo=clerk" />
  <img src="https://img.shields.io/badge/Status-In%20Progress-yellow?style=flat-square" />
</p>

---

## 🎯 Overview

**Student Budget Buddy** is a full-stack budgeting app built to help students take control of their finances. From expense tracking to budgeting and AI-powered insights, it offers a smooth and responsive experience — optimized for real-life student needs.

---

## 🔑 Core Features

- 📌 **Multi-Currency Support** — Track expenses in different currencies, auto-converted to your base.
- 📊 **Category-Based Budgeting** — Allocate budgets per category and visualize progress with smart feedback.
- 🔁 **Recurring Transactions** — Schedule daily, weekly, or monthly incomes/expenses (backend cron-powered).
- 📅 **Dashboard Insights** — Interactive pie and bar charts for monthly summaries and trends.
- 🤖 **AI Assistant** — Ask budget-related questions and get contextual, markdown-rendered responses.
- 🌓 **Modern UI/UX** — Clean, mobile-friendly design with Framer Motion animations and dark mode.

---

## ⚙️ Tech Stack

| Frontend          | Backend           | Auth   | ORM     | DB         | Deployment        |
|------------------|-------------------|--------|---------|------------|-------------------|
| Next.js 15       | Node.js + Express | Clerk  | Prisma  | PostgreSQL | Vercel / Railway  |

---

## 🧪 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/muradyusubov/student-budget-buddy.git
cd student-budget-buddy

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Sync schema with DB
npx prisma db push

# 5. Start dev server
npm run dev
```

---

## 📬 Contact

Built by [Murad Yusubov](https://github.com/biolater) — focused on building intelligent web apps and solving real-world problems with AI.
