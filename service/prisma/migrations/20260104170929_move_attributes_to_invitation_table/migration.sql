/*
  Warnings:

  - You are about to drop the column `isPrimary` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `Guest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "isPrimary",
DROP COLUMN "key";

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "key" TEXT,
ADD COLUMN     "maxGuests" INTEGER NOT NULL DEFAULT 2,
ALTER COLUMN "dateTimeAccepted" DROP DEFAULT;
