-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "backupNext" INTEGER,
ADD COLUMN     "lastPlaymaker" INTEGER,
ADD COLUMN     "lowestCard" TEXT,
ADD COLUMN     "passedPlayers" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "remainingPlayers" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
