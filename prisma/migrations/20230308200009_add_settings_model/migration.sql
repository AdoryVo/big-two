-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "gameId" TEXT,
    "rules" INTEGER NOT NULL,
    "spectating" BOOLEAN NOT NULL DEFAULT true,
    "playerMax" INTEGER NOT NULL DEFAULT 4,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_gameId_key" ON "Settings"("gameId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_id_fkey" FOREIGN KEY ("id") REFERENCES "Settings"("gameId") ON DELETE RESTRICT ON UPDATE CASCADE;
