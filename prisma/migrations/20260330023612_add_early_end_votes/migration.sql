-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "earlyEndVotes" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
