/*
  Warnings:

  - You are about to drop the column `gameId` on the `Settings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[settingsId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `settingsId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_id_fkey";

-- DropIndex
DROP INDEX "Settings_gameId_key";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "settingsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "gameId";

-- CreateIndex
CREATE UNIQUE INDEX "Game_settingsId_key" ON "Game"("settingsId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "Settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
