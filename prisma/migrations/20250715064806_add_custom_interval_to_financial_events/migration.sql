-- CreateEnum
CREATE TYPE "IntervalUnit" AS ENUM ('DAY', 'WEEK', 'MONTH', 'YEAR');

-- AlterTable
ALTER TABLE "financial_events" ADD COLUMN     "interval" INTEGER,
ADD COLUMN     "intervalUnit" "IntervalUnit";
