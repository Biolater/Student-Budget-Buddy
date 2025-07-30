import { prisma } from "@/app/lib/client";
import { CategoryType, BudgetPeriodType, FinancialEventFrequency, FinancialEventType, IntervalUnit } from "@prisma/client";

async function seed() {
  console.log("🌱 Seeding...");

  const userId = "user_30UEur8K61wP2pgEoSOtFSXN0Yg";
  const userEmail = "yusifovmurad2apple@gmail.com";
  const baseCurrencyId = "azn-id";

  // Create user
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: userEmail,
      username: "muradyusifov",
      baseCurrencyId: baseCurrencyId,
    },
  });

  console.log("✅ User created");

  // Helper function to get date months ago
  const getDateMonthsAgo = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date;
  };

  // Helper function to get date months from now
  const getDateMonthsFromNow = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date;
  };

  // Create budgets for different periods
  const budgets = [
    // Current month budgets
    {
      id: "budget-food-current",
      budgetCategoryId: "food-id",
      amount: 400,
      periodType: BudgetPeriodType.MONTHLY,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      description: "Monthly food and groceries budget"
    },
    {
      id: "budget-transport-current",
      budgetCategoryId: "transport-id",
      amount: 150,
      periodType: BudgetPeriodType.MONTHLY,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      description: "Monthly transportation budget"
    },
    {
      id: "budget-utilities-current",
      budgetCategoryId: "utilities-id",
      amount: 200,
      periodType: BudgetPeriodType.MONTHLY,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      description: "Monthly utilities budget"
    },
    {
      id: "budget-education-current",
      budgetCategoryId: "education-id",
      amount: 300,
      periodType: BudgetPeriodType.MONTHLY,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      description: "Monthly education expenses"
    },
    {
      id: "budget-shopping-current",
      budgetCategoryId: "shopping-id",
      amount: 250,
      periodType: BudgetPeriodType.MONTHLY,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      description: "Monthly shopping budget"
    },
    // Previous month budgets
    {
      id: "budget-food-prev",
      budgetCategoryId: "food-id",
      amount: 380,
      periodType: BudgetPeriodType.MONTHLY,
      startDate: getDateMonthsAgo(1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      description: "Previous month food budget"
    },
    {
      id: "budget-transport-prev",
      budgetCategoryId: "transport-id",
      amount: 140,
      periodType: BudgetPeriodType.MONTHLY,
      startDate: getDateMonthsAgo(1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      description: "Previous month transport budget"
    },
    // Quarterly budget
    {
      id: "budget-travel-quarterly",
      budgetCategoryId: "travel-id",
      amount: 1200,
      periodType: BudgetPeriodType.QUARTERLY,
      startDate: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1),
      endDate: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3 + 3, 0),
      description: "Quarterly travel budget"
    },
    // Yearly budget
    {
      id: "budget-savings-yearly",
      budgetCategoryId: "savings-id",
      amount: 5000,
      periodType: BudgetPeriodType.YEARLY,
      startDate: new Date(new Date().getFullYear(), 0, 1),
      endDate: new Date(new Date().getFullYear(), 11, 31),
      description: "Annual savings goal"
    }
  ];

  for (const budget of budgets) {
    await prisma.budget.upsert({
      where: { id: budget.id },
      update: {},
      create: {
        ...budget,
        userId,
        currencyId: baseCurrencyId,
      },
    });
  }

  console.log("✅ Budgets created");

  // Create realistic expenses for the past 6 months
  const expenses = [];

  // Generate expenses for each month
  for (let monthsAgo = 0; monthsAgo < 6; monthsAgo++) {
    const monthDate = getDateMonthsAgo(monthsAgo);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    // Food expenses (15-20 per month)
    for (let i = 0; i < 18; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      expenses.push({
        userId,
        date: new Date(year, month, day),
        amount: Math.floor(Math.random() * 50) + 10, // 10-60 AZN
        currencyId: baseCurrencyId,
        budgetId: monthsAgo === 0 ? "budget-food-current" : (monthsAgo === 1 ? "budget-food-prev" : null),
        expenseCategoryId: "food-id",
        description: ["Grocery shopping", "Lunch at university", "Coffee", "Dinner with friends", "Snacks", "Breakfast"][Math.floor(Math.random() * 6)]
      });
    }

    // Transport expenses (8-12 per month)
    for (let i = 0; i < 10; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      expenses.push({
        userId,
        date: new Date(year, month, day),
        amount: Math.floor(Math.random() * 20) + 5, // 5-25 AZN
        currencyId: baseCurrencyId,
        budgetId: monthsAgo === 0 ? "budget-transport-current" : (monthsAgo === 1 ? "budget-transport-prev" : null),
        expenseCategoryId: "transport-id",
        description: ["Bus ticket", "Metro card", "Taxi", "Gas", "Parking"][Math.floor(Math.random() * 5)]
      });
    }

    // Utilities (2-3 per month)
    for (let i = 0; i < 3; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      expenses.push({
        userId,
        date: new Date(year, month, day),
        amount: Math.floor(Math.random() * 80) + 40, // 40-120 AZN
        currencyId: baseCurrencyId,
        budgetId: monthsAgo === 0 ? "budget-utilities-current" : null,
        expenseCategoryId: "utilities-id",
        description: ["Electricity bill", "Internet bill", "Gas bill", "Water bill"][Math.floor(Math.random() * 4)]
      });
    }

    // Education expenses (3-5 per month)
    for (let i = 0; i < 4; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      expenses.push({
        userId,
        date: new Date(year, month, day),
        amount: Math.floor(Math.random() * 100) + 20, // 20-120 AZN
        currencyId: baseCurrencyId,
        budgetId: monthsAgo === 0 ? "budget-education-current" : null,
        expenseCategoryId: "education-id",
        description: ["Textbook", "Online course", "Stationery", "Printing", "Course materials"][Math.floor(Math.random() * 5)]
      });
    }

    // Shopping expenses (5-8 per month)
    for (let i = 0; i < 6; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      expenses.push({
        userId,
        date: new Date(year, month, day),
        amount: Math.floor(Math.random() * 150) + 30, // 30-180 AZN
        currencyId: baseCurrencyId,
        budgetId: monthsAgo === 0 ? "budget-shopping-current" : null,
        expenseCategoryId: "shopping-id",
        description: ["Clothes", "Electronics", "Shoes", "Accessories", "Online shopping", "Gadgets"][Math.floor(Math.random() * 6)]
      });
    }

    // Health expenses (2-3 per month)
    for (let i = 0; i < 2; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      expenses.push({
        userId,
        date: new Date(year, month, day),
        amount: Math.floor(Math.random() * 60) + 15, // 15-75 AZN
        currencyId: baseCurrencyId,
        expenseCategoryId: "health-id",
        description: ["Pharmacy", "Doctor visit", "Vitamins", "Medical supplies"][Math.floor(Math.random() * 4)]
      });
    }

    // Entertainment expenses (4-6 per month)
    for (let i = 0; i < 5; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      expenses.push({
        userId,
        date: new Date(year, month, day),
        amount: Math.floor(Math.random() * 40) + 10, // 10-50 AZN
        currencyId: baseCurrencyId,
        expenseCategoryId: "entertainment-id",
        description: ["Cinema", "Gaming", "Concert", "Sports event", "Streaming service"][Math.floor(Math.random() * 5)]
      });
    }

    // Subscriptions (1-2 per month)
    if (Math.random() > 0.3) {
      const day = Math.floor(Math.random() * 28) + 1;
      expenses.push({
        userId,
        date: new Date(year, month, day),
        amount: Math.floor(Math.random() * 30) + 10, // 10-40 AZN
        currencyId: baseCurrencyId,
        expenseCategoryId: "subscriptions-id",
        description: ["Netflix", "Spotify", "YouTube Premium", "Adobe", "Cloud storage"][Math.floor(Math.random() * 5)]
      });
    }

    // Personal care (2-3 per month)
    for (let i = 0; i < 2; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      expenses.push({
        userId,
        date: new Date(year, month, day),
        amount: Math.floor(Math.random() * 50) + 15, // 15-65 AZN
        currencyId: baseCurrencyId,
        expenseCategoryId: "personal-care-id",
        description: ["Haircut", "Skincare", "Cosmetics", "Barber", "Beauty products"][Math.floor(Math.random() * 5)]
      });
    }

    // Fitness (1-2 per month)
    if (Math.random() > 0.4) {
      const day = Math.floor(Math.random() * 28) + 1;
      expenses.push({
        userId,
        date: new Date(year, month, day),
        amount: Math.floor(Math.random() * 80) + 20, // 20-100 AZN
        currencyId: baseCurrencyId,
        expenseCategoryId: "fitness-id",
        description: ["Gym membership", "Sports equipment", "Fitness class", "Swimming"][Math.floor(Math.random() * 4)]
      });
    }

    // Travel expenses (occasional)
    if (Math.random() > 0.7) {
      const day = Math.floor(Math.random() * 28) + 1;
      expenses.push({
        userId,
        date: new Date(year, month, day),
        amount: Math.floor(Math.random() * 300) + 100, // 100-400 AZN
        currencyId: baseCurrencyId,
        budgetId: "budget-travel-quarterly",
        expenseCategoryId: "travel-id",
        description: ["Weekend trip", "Flight ticket", "Hotel", "Travel insurance"][Math.floor(Math.random() * 4)]
      });
    }
  }

  // Create expenses in batches
  for (let i = 0; i < expenses.length; i += 50) {
    const batch = expenses.slice(i, i + 50);
    await Promise.all(
      batch.map(expense =>
        prisma.expense.create({
          data: expense,
        })
      )
    );
  }

  console.log(`✅ ${expenses.length} expenses created`);

  // Create financial events (recurring transactions)
  const financialEvents = [
    // Income events
    {
      id: "event-salary",
      name: "Part-time Job Salary",
      nextDueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      amount: 800,
      currencyId: baseCurrencyId,
      budgetCategoryId: "salary-id",
      frequency: FinancialEventFrequency.MONTHLY,
      type: FinancialEventType.INCOME,
      description: "Monthly salary from part-time job",
      isActive: true
    },
    {
      id: "event-scholarship",
      name: "University Scholarship",
      nextDueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
      amount: 500,
      currencyId: baseCurrencyId,
      budgetCategoryId: "scholarship-id",
      frequency: FinancialEventFrequency.MONTHLY,
      type: FinancialEventType.INCOME,
      description: "Monthly scholarship payment",
      isActive: true
    },
    {
      id: "event-freelance",
      name: "Freelance Projects",
      nextDueDate: getDateMonthsFromNow(0),
      amount: 300,
      currencyId: baseCurrencyId,
      budgetCategoryId: "freelance-id",
      frequency: FinancialEventFrequency.MONTHLY,
      type: FinancialEventType.INCOME,
      description: "Income from freelance work",
      isActive: true
    },
    // Expense events
    {
      id: "event-rent",
      name: "Monthly Rent",
      nextDueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      amount: 600,
      currencyId: baseCurrencyId,
      budgetCategoryId: "rent-id",
      frequency: FinancialEventFrequency.MONTHLY,
      type: FinancialEventType.EXPENSE,
      description: "Monthly apartment rent",
      isActive: true
    },
    {
      id: "event-phone",
      name: "Phone Bill",
      nextDueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
      amount: 25,
      currencyId: baseCurrencyId,
      budgetCategoryId: "utilities-id",
      frequency: FinancialEventFrequency.MONTHLY,
      type: FinancialEventType.EXPENSE,
      description: "Monthly phone and data plan",
      isActive: true
    },
    {
      id: "event-netflix",
      name: "Netflix Subscription",
      nextDueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
      amount: 15,
      currencyId: baseCurrencyId,
      budgetCategoryId: "subscriptions-id",
      frequency: FinancialEventFrequency.MONTHLY,
      type: FinancialEventType.EXPENSE,
      description: "Monthly Netflix subscription",
      isActive: true
    },
    {
      id: "event-spotify",
      name: "Spotify Premium",
      nextDueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 12),
      amount: 8,
      currencyId: baseCurrencyId,
      budgetCategoryId: "subscriptions-id",
      frequency: FinancialEventFrequency.MONTHLY,
      type: FinancialEventType.EXPENSE,
      description: "Monthly Spotify Premium subscription",
      isActive: true
    },
    {
      id: "event-gym",
      name: "Gym Membership",
      nextDueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      amount: 50,
      currencyId: baseCurrencyId,
      budgetCategoryId: "health-id",
      frequency: FinancialEventFrequency.MONTHLY,
      type: FinancialEventType.EXPENSE,
      description: "Monthly gym membership",
      isActive: true
    },
    {
      id: "event-insurance",
      name: "Health Insurance",
      nextDueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      amount: 80,
      currencyId: baseCurrencyId,
      budgetCategoryId: "health-id",
      frequency: FinancialEventFrequency.QUARTERLY,
      type: FinancialEventType.EXPENSE,
      description: "Quarterly health insurance payment",
      isActive: true
    },
    {
      id: "event-savings",
      name: "Emergency Savings",
      nextDueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      amount: 200,
      currencyId: baseCurrencyId,
      budgetCategoryId: "savings-id",
      frequency: FinancialEventFrequency.MONTHLY,
      type: FinancialEventType.EXPENSE,
      description: "Monthly transfer to emergency savings",
      isActive: true
    }
  ];

  for (const event of financialEvents) {
    await prisma.financialEvent.upsert({
      where: { id: event.id },
      update: {},
      create: {
        ...event,
        userId,
      },
    });
  }

  console.log("✅ Financial events created");
  console.log("✅ Seeding complete with comprehensive example data!");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });