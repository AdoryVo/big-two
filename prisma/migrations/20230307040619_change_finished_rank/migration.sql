/*
  Warnings:

  - You are about to drop the column `finished` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "finished",
ADD COLUMN     "finishedRank" INTEGER NOT NULL DEFAULT 0;
