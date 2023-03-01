-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "deck" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "combo" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "hand" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "points" INTEGER NOT NULL DEFAULT 0,
    "gameId" TEXT NOT NULL,
    "currentInId" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_currentInId_key" ON "Player"("currentInId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_currentInId_fkey" FOREIGN KEY ("currentInId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
