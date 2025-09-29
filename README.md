<h1 align="center">🧠 Student Budget Buddy</h1>
<p align="center">
    <i>Track smarter. Save better. A focused budgeting app tailored for students.</i>
</p>

<p align="center">
    <img src="./public/sbb-banner.png" />
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Next.js-15-blue?style=flat-square&logo=next.js" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat-square&logo=postgresql" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" />
    <img src="https://img.shields.io/badge/Clerk-Auth-orange?style=flat-square&logo=clerk" />
    <img src="https://img.shields.io/badge/Status-Complete-brightgreen?style=flat-square" />
</p>

---

## ✅ Features

- **Expense Tracking:** Record and categorize expenses with support for multiple currencies.
- **Category-Based Budgeting:** Set budgets per category with custom or preset time periods.
- **Dashboard Overview:** View total income, expenses, remaining balance, and savings rate. Includes pie charts and trends.
- **Recurring Transactions:** Define and track recurring financial events (e.g. rent, subscriptions).
- **Multi-Currency Support:** Manage expenses and budgets across different currencies.
- **Secure Authentication:** Seamless auth powered by Clerk.
- **AI Assistant (Beta):** Integrated AI drawer that can respond to user prompts about financial status.

---

## 🛠 Tech Stack

| Frontend              | Backend           | ORM     | Database   | Auth    | Deployment |
|----------------------|-------------------|---------|------------|---------|------------|
| Next.js 15 (App Router) | Node.js, Express | Prisma  | PostgreSQL | Clerk   | Vercel (FE) / Render (BE) |

---

## 📈 Screenshots

| Dashboard Overview | Expense Tracker |
|--------------------|-----------------|
| ![Dashboard](./public/screenshots/dashboard-full.png) | ![Expenses](./public/screenshots/expense-form-and-history.png) |

| Recurring Transactions | Budget Management |
|------------------------|-------------------|
| ![Recurring](./public/screenshots/recurring-transactions.png) | ![Budget](./public/screenshots/budget-management.png) |

| AI Assistant: Bills Due | AI Assistant: Grocery Insights |
|-------------------------|--------------------------------|
| ![AI Bills](./public/screenshots/ai-assistant-bills.png) | ![AI Groceries](./public/screenshots/ai-assistant-groceries.png) |

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/muradyusubov/student-budget-buddy.git

# 2. Move into the folder
cd student-budget-buddy

# 3. Install dependencies
npm install

# 4. Setup environment variables
cp .env.example .env

# 5. Push the Prisma schema to your database
npx prisma db push

# 6. Run the development server
npm run dev
```

---

## 👨‍💻 Author

Built by [Murad Yusubov](https://github.com/biolater) — passionate about building intelligent web applications that solve real-world problems.

---

## 📬 Feedback

Found a bug or have a suggestion? Feel free to [open an issue](https://github.com/biolater/student-budget-buddy/issues) or reach out directly.
