/*
  Warnings:

  - A unique constraint covering the columns `[name,gameId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Player_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_gameId_key" ON "Player"("name", "gameId");
