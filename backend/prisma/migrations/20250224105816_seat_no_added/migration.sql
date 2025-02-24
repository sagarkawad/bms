/*
  Warnings:

  - You are about to drop the column `name` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `seat` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "name",
ADD COLUMN     "seat" TEXT NOT NULL;
