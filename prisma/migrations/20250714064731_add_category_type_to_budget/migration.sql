-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('INCOME', 'EXPENSE');

-- AlterTable
ALTER TABLE "budget_categories" ADD COLUMN     "type" "CategoryType" NOT NULL DEFAULT 'EXPENSE';
