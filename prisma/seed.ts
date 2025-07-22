import { prisma } from "@/app/lib/client";
import { CategoryType } from "@prisma/client";

async function seed() {
  console.log("🌱 Seeding...");

  // Budget Categories
  const budgetCategories = [
    { id: "rent-id", name: "Rent", icon: "🏠", description: "Monthly housing cost", type: CategoryType.EXPENSE },
    { id: "food-id", name: "Food & Groceries", icon: "🍔", description: "Groceries, meals, snacks", type: CategoryType.EXPENSE },
    { id: "transport-id", name: "Transport", icon: "🚌", description: "Bus, gas, taxi, and travel", type: CategoryType.EXPENSE },
    { id: "utilities-id", name: "Utilities", icon: "💡", description: "Electricity, internet, gas", type: CategoryType.EXPENSE },
    { id: "subscriptions-id", name: "Subscriptions", icon: "📺", description: "Netflix, Spotify, etc.", type: CategoryType.EXPENSE },
    { id: "education-id", name: "Education", icon: "📚", description: "Books, tuition, online courses", type: CategoryType.EXPENSE },
    { id: "health-id", name: "Health", icon: "⚕️", description: "Pharmacy, doctor, medical", type: CategoryType.EXPENSE },
    { id: "shopping-id", name: "Shopping", icon: "🛍️", description: "Clothes, gadgets, online shopping", type: CategoryType.EXPENSE },
    { id: "travel-id", name: "Travel", icon: "✈️", description: "Flights, hotels, trips", type: CategoryType.EXPENSE },
    { id: "personal-care-id", name: "Personal Care", icon: "🧴", description: "Haircuts, skincare", type: CategoryType.EXPENSE },
    { id: "gifts-id", name: "Gifts & Donations", icon: "🎁", description: "Gifts, charity", type: CategoryType.EXPENSE },
    { id: "savings-id", name: "Savings", icon: "💾", description: "Emergency or goal savings", type: CategoryType.EXPENSE },
    { id: "salary-id", name: "Salary", icon: "💼", description: "Full-time or part-time job income", type: CategoryType.INCOME },
    { id: "freelance-id", name: "Freelance", icon: "🧑‍💻", description: "Gig and freelance income", type: CategoryType.INCOME },
    { id: "scholarship-id", name: "Scholarship", icon: "🎓", description: "Financial aid or grants", type: CategoryType.INCOME },
    { id: "stipend-id", name: "Stipend", icon: "💸", description: "Monthly research or university income", type: CategoryType.INCOME },
    { id: "gift-income-id", name: "Gift Income", icon: "🎁", description: "Received from others", type: CategoryType.INCOME },
    { id: "investment-id", name: "Investment", icon: "📈", description: "Passive income from assets", type: CategoryType.INCOME },
    { id: "other-income-id", name: "Other Income", icon: "➕", description: "Miscellaneous income", type: CategoryType.INCOME },
  ];

  for (const category of budgetCategories) {
    await prisma.budgetCategory.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  // Expense Categories
const expenseCategories = [
    { id: "food-id", name: "Food & Groceries", icon: "🍔" },
    { id: "transport-id", name: "Transport", icon: "🚌" },
    { id: "utilities-id", name: "Utilities", icon: "💡" },
    { id: "subscriptions-id", name: "Subscriptions", icon: "📺" },
    { id: "education-id", name: "Education", icon: "📚" },
    { id: "health-id", name: "Health", icon: "⚕️" },
    { id: "shopping-id", name: "Shopping", icon: "🛍️" },
    { id: "entertainment-id", name: "Entertainment", icon: "🎮" },
    { id: "gifts-id", name: "Gifts & Donations", icon: "🎁" },
    { id: "travel-id", name: "Travel", icon: "✈️" },
    { id: "personal-care-id", name: "Personal Care", icon: "🧴" },
    { id: "fitness-id", name: "Fitness", icon: "🏋️" },
    { id: "home-id", name: "Home Supplies", icon: "🧻" },
    { id: "phone-id", name: "Phone & Data", icon: "📱" },
    { id: "other-id", name: "Other", icon: "🌀" },
  ];

  for (const category of expenseCategories) {
    await prisma.expenseCategory.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  // Currencies
  const currencies = [
    { id: "usd-id", code: "USD", name: "US Dollar", symbol: "$" },
    { id: "eur-id", code: "EUR", name: "Euro", symbol: "€" },
    { id: "gbp-id", code: "GBP", name: "British Pound", symbol: "£" },
    { id: "try-id", code: "TRY", name: "Turkish Lira", symbol: "₺" },
    { id: "azn-id", code: "AZN", name: "Azerbaijani Manat", symbol: "₼" },
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { id: currency.id },
      update: {},
      create: currency,
    });
  }

  console.log("✅ Seeding complete.");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
